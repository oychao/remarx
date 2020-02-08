import { config } from '../config';
import { ImplementedNode } from './node/implementedNode';
import { LogicAbstractProgram } from './node/logicAbstractProgram';
import { LogicProgramCommon } from './node/logicProgramCommon';
import { LogicProgramEntrance } from './node/logicProgramEntrance';
import { LogicTopScope, TopScopeDepend } from './node/logicTopScope';

export class DependencyGraph extends LogicAbstractProgram {
  protected astNode: ImplementedNode | undefined;

  protected fullPath: string;
  private program: LogicProgramEntrance;

  constructor(fullPath: string) {
    super(fullPath);
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

    await LogicTopScope.dfsWalkTopScopeMap(
      this.program.selectorReactDom.scopeDepMap,
      async (dep: TopScopeDepend): Promise<void> => {
        if (dep instanceof LogicTopScope) {
          queue.push(dep);
          const { depSign } = dep;
          dependencies.push([entrance, depSign]);
          scopes.add(depSign);
        } else if (typeof dep === 'string') {
          scopes.add(dep);
        }
      }
    );

    let currScope: LogicTopScope = queue.pop() as LogicTopScope;
    while (currScope) {
      if (currScope instanceof LogicTopScope) {
        const { depSign } = currScope;
        scopes.add(depSign);
        await currScope.forEachDepScope(async dep => {
          if (dep instanceof LogicTopScope) {
            queue.push(dep);
            dependencies.push([depSign, dep.depSign]);
          } else if (typeof dep === 'string') {
            scopes.add(dep);
            dependencies.push([depSign, dep]);
          }
        });
      }

      currScope = queue.pop() as LogicTopScope;
    }

    return {
      nodes: Array.from(scopes),
      dependencies,
    };
  }
}
