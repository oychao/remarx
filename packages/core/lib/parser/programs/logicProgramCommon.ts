import * as parser from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';

import { getConfig } from '../../config';
import { PARSE_CONFIG } from '../../constant';
import { DepPlugin } from '../../plugin/depPlugin';
import { simplifyAst } from '../../utils';
import { ExtendedNode } from '../astNodes/extendedNode';
import { parseAstToExtendedNode } from '../astNodes/nodeFactory';
import { LogicAbstractProgram } from './logicAbstractProgram';

export type ProgramDepend = LogicProgramCommon | string | undefined;

export type ProgramMap = { [key: string]: ProgramDepend };

const wait = async function(t: number): Promise<void> {
  return new Promise(res => setTimeout(res, t));
};

export class LogicProgramCommon extends LogicAbstractProgram {
  private static PluginClasses: Array<Type<DepPlugin>> = [];

  private static postMessage: (message: any) => void = () => undefined;

  public static install<T extends DepPlugin>(pluginClass: { new (): T }): void {
    LogicProgramCommon.PluginClasses.push(pluginClass);
  }

  public static setPostMessage(postMessage: (message: any) => void) {
    LogicProgramCommon.postMessage = postMessage;
  }

  // program node pool
  public static pool: { [key: string]: LogicProgramCommon } = {};

  public static async produce(fullPath: string) {
    let ret: LogicProgramCommon | undefined = LogicProgramCommon.pool[fullPath];
    if (!ret) {
      ret = new LogicProgramCommon(fullPath);
      LogicProgramCommon.pool[fullPath] = ret;
      await ret.parse();
    }
    return ret;
  }

  public static purge(): void {
    LogicProgramCommon.pool = {};
  }

  protected astNode: ExtendedNode<LogicProgramCommon> | undefined;

  private initialized: boolean = false;

  public fullPath: string;

  // plugins
  private pluginMap: { [key: string]: DepPlugin } = {};
  private pluginList: DepPlugin[] = [];

  // file dependencies
  public fileDepMap: ProgramMap = {};
  public fileDepMapEffective: ProgramMap = {};

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;

    // initialize plugins
    LogicProgramCommon.PluginClasses.forEach(PluginClass => {
      if (!this.pluginMap[PluginClass.name]) {
        this.pluginMap[PluginClass.name] = Reflect.construct(PluginClass, [this]);
        this.pluginList.push(this.pluginMap[PluginClass.name]);
      }
    });
  }

  // TODO do sth. after specific plugin done executing
  protected afterPluginExecuted<T extends DepPlugin>(): void {}

  public getPluginInstance<T extends DepPlugin>(pluginClass: Type<T>): T {
    return this.pluginMap[pluginClass.name] as T;
  }

  public async parse(): Promise<void> {
    if (this.initialized) {
      return;
    }
    const enterFileBuffer = await fs.promises.readFile(this.fullPath);
    const enterFileStr = enterFileBuffer.toString();
    const astObj = simplifyAst(parser.parse(enterFileStr, PARSE_CONFIG));

    if (getConfig().debug?.on) {
      const astStr = JSON.stringify(astObj, null, 2);
      const astDir = this.dirPath.replace(getConfig().rootDir, getConfig().debug.rootDir);
      try {
        await fs.promises.access(astDir);
      } catch {
        await fs.promises.mkdir(astDir, { recursive: true });
      }
      const astFullPath = path.resolve(astDir, `${this.filename}.json`);
      await fs.promises.writeFile(astFullPath, astStr);
    }
    this.astNode = parseAstToExtendedNode(astObj);

    // set `this` as logicNode of current ast node
    this.astNode.logicNode = this;

    // this.pluginList.forEach(plugin => this.astNode?.accept(plugin));
    for (let i = 0; i < this.pluginList.length; i++) {
      const plugin = this.pluginList[i];
      plugin.beforeVisit(LogicProgramCommon.postMessage);
      await this.astNode.accept(plugin);
      await wait(20);
      plugin.afterVisit(LogicProgramCommon.postMessage);
    }
    // mark as initialized
    this.initialized = true;
  }

  public async forEachDepFile(cb: (dep: ProgramDepend, key: string, deps?: ProgramMap) => Promise<void>) {
    for (const key in this.fileDepMapEffective) {
      if (this.fileDepMapEffective.hasOwnProperty(key)) {
        const fileDep = this.fileDepMapEffective[key];
        cb.call(null, fileDep, key, this.fileDepMapEffective);
      }
    }
  }
}
