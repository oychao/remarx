import { setConfig } from './config';
import { ExtendedNode } from './parser/astNodes/extendedNode';
import { LogicAbstractDepNode, TopScopeDepend } from './parser/compDeps/logicAbstractDepNode';
import { LogicHookUsableClass, UseStateStruct } from './parser/compDeps/logicHookUsable';
import { LogicAbstractProgram } from './parser/programs/logicAbstractProgram';
import { LogicProgramCommon } from './parser/programs/logicProgramCommon';
import { LogicProgramEntrance } from './parser/programs/logicProgramEntrance';
import { ClassCompProvider } from './plugin/classCompProvider';
import { ComponentDepPlugin } from './plugin/componentDepPlugin';
import { DepFilePlugin } from './plugin/depFilePlugin';
import { DepPlugin } from './plugin/depPlugin';
import { ExportScopeProvider } from './plugin/exportScopeProvider';
import { ImportScopeProvider } from './plugin/importScopeProvider';
import { LocalScopeProvider } from './plugin/localScopeProvider';
import { Config } from './types';

// install intrinsic program parser plugins
[
  DepFilePlugin,
  LocalScopeProvider,
  ClassCompProvider,
  ExportScopeProvider,
  ImportScopeProvider,
  ComponentDepPlugin,
].forEach((PluginClass: Type<DepPlugin>) => LogicProgramCommon.install(PluginClass));

export class Remarx extends LogicAbstractProgram {
  public static install = LogicProgramCommon.install;

  public static purgeCache = LogicProgramCommon.purge;

  public static setPostMessage = LogicProgramCommon.setPostMessage;

  protected astNode: ExtendedNode | undefined;

  protected fullPath: string;
  private program: LogicProgramEntrance;

  constructor(config: Config, fullPath: string) {
    super(fullPath);

    setConfig(config);

    this.fullPath = fullPath;
    this.program = new LogicProgramEntrance(this.fullPath);
  }

  public async parse(): Promise<void> {
    await this.program.parse();
  }

  /**
   * output file dependency dag
   */
  public async getFileDepDag(): Promise<GraphView> {
    const files: { [key: string]: boolean } = {};
    const dependencies: [string, string][] = [];

    const queue: LogicProgramCommon[] = [this.program];
    let currProgram: LogicProgramCommon = queue.pop() as LogicProgramCommon;

    while (currProgram) {
      if (currProgram instanceof LogicProgramCommon) {
        files[currProgram.fullPath] = true;
        await currProgram.forEachDepFile(async dep => {
          if (dep instanceof LogicProgramCommon) {
            queue.push(dep);
            dependencies.push([currProgram.fullPath, dep.fullPath]);
          } else if (typeof dep === 'string') {
            files[dep] = true;
            dependencies.push([currProgram.fullPath, dep]);
          }
        });
      }
      currProgram = queue.pop() as LogicProgramCommon;
    }

    return {
      nodes: files,
      dependencies,
    };
  }

  /**
   * output hook & component dependency dag
   */
  public async getTopScopeDag(): Promise<GraphView> {
    const scopes: { [key: string]: UseStateStruct } = {};
    const dependencies: [string, string][] = [];

    const entrance: string = `${this.program.fullPath}#ReactDOM`;

    scopes[entrance] = null;

    const queue: TopScopeDepend[] = [];

    await LogicAbstractDepNode.dfsWalkTopScopeMap(
      this.program.selectorReactDom.scopeDepMap,
      async (dep: TopScopeDepend): Promise<void> => {
        if (dep instanceof LogicAbstractDepNode) {
          queue.push(dep);
          const { depSign } = dep;
          dependencies.push([entrance, depSign]);
          if (dep instanceof LogicHookUsableClass) {
            scopes[depSign] = dep.useStateStore;
          } else {
            scopes[depSign] = null;
          }
        } else if (typeof dep === 'string') {
          scopes[dep] = null;
        }
      }
    );

    let currScope: TopScopeDepend = queue.pop() as TopScopeDepend;
    while (currScope) {
      if (currScope instanceof LogicAbstractDepNode) {
        const { depSign } = currScope;
        if (currScope instanceof LogicHookUsableClass) {
          scopes[depSign] = currScope.useStateStore;
        } else {
          scopes[depSign] = null;
        }
        await currScope.forEachDepScope(async dep => {
          if (dep instanceof LogicAbstractDepNode) {
            queue.push(dep);
            dependencies.push([depSign, dep.depSign]);
          } else if (typeof dep === 'string') {
            scopes[dep] = null;
            dependencies.push([depSign, dep]);
          }
        });
      }

      currScope = queue.pop() as LogicAbstractDepNode;
    }

    return {
      nodes: scopes,
      dependencies,
    };
  }
}
