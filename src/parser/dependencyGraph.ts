import * as dagre from 'dagre';

import { ScopeNodeDepend, TopScope } from './node/logicTopScope';
import { LogicProgram } from './node/logicProgram';
import { LogicProgramBase } from './node/logicProgramBase';
import { LogicProgramRoot } from './node/logicProgramRoot';

export class DependencyGraph extends LogicProgramBase {
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

  protected fullPath: string;
  private program: LogicProgramRoot;

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
    this.program = new LogicProgramRoot(this.fullPath);
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

    const queue: LogicProgram[] = [this.program];
    let currProgram: LogicProgram | undefined = queue.pop();

    while (currProgram) {
      files.add(currProgram.fullPath);
      await currProgram.forEachDepFile(async dep => {
        queue.push(dep);
        if (currProgram) {
          dependencies.push([currProgram.fullPath, dep.fullPath]);
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

    const queue: ScopeNodeDepend[] = Object.values(this.program.visitorReactDom.compDepMap);

    queue.forEach(scope => {
      if (scope instanceof TopScope) {
        const { depSign } = scope;
        dependencies.push(['ReactDOM', depSign]);
        scopes.add(depSign);
      }
    });

    let currScope: TopScope = queue.pop() as TopScope;
    while (currScope) {
      const { depSign } = currScope;
      scopes.add(depSign);
      const deps = [...Object.values(currScope.scopeDepMap)];
      deps.forEach(dep => {
        if (dep instanceof TopScope) {
          queue.push(dep);
          dependencies.push([depSign, dep.depSign]);
        }
      });
    }

    return DependencyGraph.calcGraph(Array.from(scopes), dependencies);
  }
}
