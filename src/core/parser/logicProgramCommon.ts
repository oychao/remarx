import * as parser from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';

import { config } from '../../config';
import { PARSE_CONFIG } from '../../constants';
import { simplifyAst } from '../../utils';
import { DepPlugin } from '../plugin/depPlugin';
import { ImplementedNode } from './implementedNode';
import { LogicAbstractProgram } from './logicAbstractProgram';
import { parseAstToImplementedNode } from './nodeFactory';

export type ProgramDepend = LogicProgramCommon | string | undefined;

export type ProgramMap = { [key: string]: ProgramDepend };

export class LogicProgramCommon extends LogicAbstractProgram {
  private static PluginClasses: Array<Type<DepPlugin>> = [];

  public static install<T extends DepPlugin>(pluginClass: { new (): T }): void {
    LogicProgramCommon.PluginClasses.push(pluginClass);
  }

  // program node pool
  public static pool: { [key: string]: LogicProgramCommon } = {};

  public static async produce(fullPath: string) {
    let ret: LogicProgramCommon | undefined = LogicProgramCommon.pool[fullPath];
    if (!ret) {
      ret = new LogicProgramCommon(fullPath);
      await ret.parse();
      LogicProgramCommon.pool[fullPath] = ret;
    }
    return ret;
  }

  public static purge(): void {
    LogicProgramCommon.pool = {};
  }

  protected astNode: ImplementedNode<LogicProgramCommon> | undefined;

  private initialized: boolean = false;

  public fullPath: string;

  // plugins
  private pluginMap: { [key: string]: DepPlugin } = {};
  private pluginList: DepPlugin[] = [];

  // file dependencies
  public fileDepMap: ProgramMap = {};

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;

    // initialize plugins
    LogicProgramCommon.PluginClasses.forEach(PluginClass => {
      this.pluginMap[PluginClass.name] = Reflect.construct(PluginClass, [this]);
      this.pluginList.push(this.pluginMap[PluginClass.name]);
    });
  }

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

    if (config.debug?.on) {
      const astStr = JSON.stringify(astObj, null, 2);
      const astDir = this.dirPath.replace(config.rootDir, config.debug.rootDir);
      try {
        await fs.promises.access(astDir);
      } catch {
        await fs.promises.mkdir(astDir, { recursive: true });
      }
      const astFullPath = path.resolve(astDir, `${this.filename}.json`);
      await fs.promises.writeFile(astFullPath, astStr);
    }
    this.astNode = parseAstToImplementedNode(astObj);

    // set `this` as logicNode of current ast node
    this.astNode.logicNode = this;

    // this.pluginList.forEach(plugin => this.astNode?.accept(plugin));
    for (let i = 0; i < this.pluginList.length; i++) {
      const plugin = this.pluginList[i];
      await this.astNode.accept(plugin);
    }

    // mark as initialized
    this.initialized = true;
  }

  public async forEachDepFile(cb: (dep: ProgramDepend, key: string, deps?: ProgramMap) => Promise<void>) {
    for (const key in this.fileDepMap) {
      if (this.fileDepMap.hasOwnProperty(key)) {
        const fileDep = this.fileDepMap[key];
        cb.call(null, fileDep, key, this.fileDepMap);
      }
    }
  }
}
