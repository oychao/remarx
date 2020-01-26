import * as dagre from 'dagre';

import { ProgramBase } from './programBase';
import { ProgramRoot } from './programRoot';
import { Program } from './program';

export class DependencyGraph extends ProgramBase {
  protected fullPath: string;
  private program: ProgramRoot;

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
    this.program = new ProgramRoot(this.fullPath);
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

    const queue: Program[] = [this.program];
    let currProgram = queue.pop();

    while (currProgram) {
      files.add(currProgram.fullPath);
      await currProgram.forEachDepFile(async dep => {
        queue.push(dep);
      });

      await currProgram.forEachDepFile(async dep => {
        if (currProgram) {
          dependencies.push([currProgram.fullPath, dep.fullPath]);
        }
      });

      currProgram = queue.pop();
    }

    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    files.forEach(file => {
      g.setNode(file, { label: file, width: 50, height: 50 });
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

  /**
   * output hook & component dependency dag
   */
  public async getTopScopeDag(): Promise<TopScopeDependencyDag | null> {
    return null;
  }
}
