import * as parser from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';

import { config } from '../../config';
import { PARSE_CONFIG } from '../../constants';
import { simplifyAst } from '../../utils';
import { DepFilePlugin } from '../plugin/depFilePlugin';
import { ExportScopeProvider } from '../plugin/exportScopeProvider';
import { ImportScopeProvider } from '../plugin/importScopeProvider';
import { LocalScopeProvider } from '../plugin/localScopeProvider';
import { TopScopeDepPlugin } from '../plugin/topScopeDepPlugin';
import { ImplementedNode } from './implementedNode';
import { LogicAbstractProgram } from './logicAbstractProgram';
import { parseAstToImplementedNode } from './nodeFactory';

export type ProgramDepend = LogicProgramCommon | string | undefined;

export type ProgramMap = { [key: string]: ProgramDepend };

export class LogicProgramCommon extends LogicAbstractProgram {
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

  // selectors
  public depFilePlugin: DepFilePlugin = new DepFilePlugin(this);
  public localScopeProvider: LocalScopeProvider = new LocalScopeProvider(this);
  public exportScopeProvider: ExportScopeProvider = new ExportScopeProvider(this);
  public importScopeProvider: ImportScopeProvider = new ImportScopeProvider(this);
  public topScopeDepPlugin: TopScopeDepPlugin = new TopScopeDepPlugin(this);

  // file dependencies
  public fileDepMap: ProgramMap = {};

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
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

    // parse file dependencies
    await this.astNode.accept(this.depFilePlugin);
    // parse scopes
    await this.astNode.accept(this.localScopeProvider);
    await this.astNode.accept(this.exportScopeProvider);
    await this.astNode.accept(this.importScopeProvider);
    // parse scope dependencies
    await this.astNode.accept(this.topScopeDepPlugin);

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
