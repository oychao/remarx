import { setConfig } from './config';
import { ExtendedNode } from './parser/astNodes/extendedNode';
import { LogicAbstractDepNode, TopScopeDepend } from './parser/compDeps/logicAbstractDepNode';
import { LogicAbstractProgram } from './parser/programs/logicAbstractProgram';
import { LogicProgramCommon } from './parser/programs/logicProgramCommon';
import { LogicProgramEntrance } from './parser/programs/logicProgramEntrance';
// import { TopScopeDepend } from './parser/logicTopScope';
import { ClassCompProvider } from './plugin/classCompProvider';
import { DepFilePlugin } from './plugin/depFilePlugin';
import { DepPlugin } from './plugin/depPlugin';
import { ExportScopeProvider } from './plugin/exportScopeProvider';
import { ImportScopeProvider } from './plugin/importScopeProvider';
import { LocalScopeProvider } from './plugin/localScopeProvider';
import { ComponentDepPlugin } from './plugin/componentDepPlugin';
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
    const files = new Set<string>();
    const dependencies: [string, string][] = [];

    const queue: LogicProgramCommon[] = [this.program];
    let currProgram: LogicProgramCommon = queue.pop() as LogicProgramCommon;

    while (currProgram) {
      if (currProgram instanceof LogicProgramCommon) {
        files.add(currProgram.fullPath);
        await currProgram.forEachDepFile(async dep => {
          if (dep instanceof LogicProgramCommon) {
            queue.push(dep);
            dependencies.push([currProgram.fullPath, dep.fullPath]);
          } else if (typeof dep === 'string') {
            files.add(dep);
            dependencies.push([currProgram.fullPath, dep]);
          }
        });
      }
      currProgram = queue.pop() as LogicProgramCommon;
    }

    return {
      nodes: Array.from(files),
      dependencies,
    };
  }

  /**
   * output hook & component dependency dag
   */
  public async getTopScopeDag(): Promise<GraphView> {
    const scopes = new Set<string>();
    const dependencies: [string, string][] = [];

    const entrance: string = `${this.program.fullPath}#ReactDOM`;

    scopes.add(entrance);

    const queue: TopScopeDepend[] = [];

    await LogicAbstractDepNode.dfsWalkTopScopeMap(
      this.program.selectorReactDom.scopeDepMap,
      async (dep: TopScopeDepend): Promise<void> => {
        if (dep instanceof LogicAbstractDepNode) {
          queue.push(dep);
          const { depSign } = dep;
          dependencies.push([entrance, depSign]);
          scopes.add(depSign);
        } else if (typeof dep === 'string') {
          scopes.add(dep);
        }
      }
    );

    let currScope: TopScopeDepend = queue.pop() as TopScopeDepend;
    while (currScope) {
      if (currScope instanceof LogicAbstractDepNode) {
        const { depSign } = currScope;
        scopes.add(depSign);
        await currScope.forEachDepScope(async dep => {
          if (dep instanceof LogicAbstractDepNode) {
            queue.push(dep);
            dependencies.push([depSign, dep.depSign]);
          } else if (typeof dep === 'string') {
            scopes.add(dep);
            dependencies.push([depSign, dep]);
          }
        });
      }

      currScope = queue.pop() as LogicAbstractDepNode;
    }

    return {
      nodes: Array.from(scopes),
      dependencies,
    };
  }
}
