import * as dagre from 'dagre';

export function startWithCapitalLetter(str: string): boolean {
  const charCode = str.charCodeAt(0);
  return charCode > 64 && charCode < 91;
}

export function calcGraph(graphView: GraphView): DAGraphView {
  const { nodes: rawNodes, dependencies } = graphView;

  const g = new dagre.graphlib.Graph();

  g.setGraph({ rankdir: 'LR' });
  g.setDefaultEdgeLabel(() => ({}));

  rawNodes.forEach(node => {
    g.setNode(node, { label: node, width: 120, height: 40 });
  });
  dependencies.forEach(([from, to]) => {
    g.setEdge(from, to);
  });

  dagre.layout(g, {
    rankdir: 'LR',
  });

  const nodes = g.nodes().map(n => g.node(n));
  const edges = g.edges().map(e => g.edge(e));

  return { nodes, edges };
}
