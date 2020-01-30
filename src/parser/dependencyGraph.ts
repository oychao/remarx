import * as dagre from 'dagre';

import { ImplementedNode } from './node/implementedNode';
import { LogicAbstractProgram } from './node/logicAbstractProgram';
import { LogicProgramCommon } from './node/logicProgramCommon';
import { LogicProgramEntrance } from './node/logicProgramEntrance';
import { LogicTopScope, TopScopeDepend } from './node/logicTopScope';

export class DependencyGraph extends LogicAbstractProgram {
  private static calcGraph(nodes: string[], dependencies: [string, string][]): GraphView {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach(node => {
      g.setNode(node, { label: node, width: 50, height: 50 });
    });
    dependencies.forEach(([from, to]) => {
      g.setEdge(from, to);
    });

    dagre.layout(g);

    return {
      nodes: g.nodes().map(n => g.node(n)),
      edges: g.edges().map(e => g.edge(e)),
    };
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
        if (dep) {
          queue.push(dep);
          if (currProgram) {
            dependencies.push([currProgram.fullPath, dep.fullPath]);
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

    scopes.add('ReactDOM');

    const queue: TopScopeDepend[] = Object.values(this.program.visitorReactDom.scopeDepMap);

    queue.forEach(scope => {
      if (scope instanceof LogicTopScope) {
        const { depSign } = scope;
        dependencies.push(['ReactDOM', depSign]);
        scopes.add(depSign);
      }
    });

    let currScope: LogicTopScope = queue.pop() as LogicTopScope;
    while (currScope) {
      const { depSign } = currScope;
      scopes.add(depSign);
      currScope.forEachDepScope(async dep => {
        if (dep instanceof LogicTopScope) {
          queue.push(dep);
          dependencies.push([depSign, dep.depSign]);
        }
      });

      currScope = queue.pop() as LogicTopScope;
    }

    return DependencyGraph.calcGraph(Array.from(scopes), dependencies);
  }
}
