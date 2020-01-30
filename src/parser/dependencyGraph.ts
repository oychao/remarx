import * as dagre from 'dagre';

import { config } from '../config';
import { ImplementedNode } from './node/implementedNode';
import { LogicAbstractProgram } from './node/logicAbstractProgram';
import { LogicProgramCommon } from './node/logicProgramCommon';
import { LogicProgramEntrance } from './node/logicProgramEntrance';
import { LogicTopScope, TopScopeDepend } from './node/logicTopScope';

export class DependencyGraph extends LogicAbstractProgram {
  private static calcGraph(rawNodes: string[], dependencies: [string, string][]): GraphView {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    rawNodes.forEach(node => {
      g.setNode(node, { label: node, width: 50, height: 50 });
    });
    dependencies.forEach(([from, to]) => {
      g.setEdge(from, to);
    });

    dagre.layout(g);

    const nodes = g.nodes().map(n => g.node(n));
    const edges = g.edges().map(e => g.edge(e));

    nodes.forEach(node => {
      node.label = (node.label as string).replace(config.rootDir, '.');
    });

    return { nodes, edges };
  }

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
    let currProgram: LogicProgramCommon | undefined = queue.pop();

    while (currProgram) {
      files.add(currProgram.fullPath);
      await currProgram.forEachDepFile(async dep => {
        if (dep instanceof LogicProgramCommon) {
          queue.push(dep);
          if (currProgram) {
            dependencies.push([currProgram.fullPath, dep.fullPath]);
          }
        } else if (typeof dep === 'string') {
          if (currProgram) {
            dependencies.push([currProgram.fullPath, dep]);
          }
        }
      });

      currProgram = queue.pop();
    }

    return DependencyGraph.calcGraph(Array.from(files), dependencies);
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
      this.program.visitorReactDom.scopeDepMap,
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

    return DependencyGraph.calcGraph(Array.from(scopes), dependencies);
  }
}
