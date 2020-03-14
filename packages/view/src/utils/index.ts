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

  Object.entries(rawNodes).forEach(([node, detail]) => {
    g.setNode(node, { label: node, width: 120, height: 40, detail });
  });
  dependencies.forEach(([from, to]) => {
    g.setEdge(from, to);
  });

  dagre.layout(g, {
    rankdir: 'LR',
  });

  let nodes = g.nodes().map(n => g.node(n));
  let edges = g.edges().map(e => g.edge(e));

  let minX = 0;
  let minY = 0;

  nodes.forEach(node => {
    minX = node.x < minX ? node.x : minX;
    minY = node.y < minY ? node.y : minY;
  });

  edges.forEach(edge => {
    edge.points.forEach(point => {
      minX = point.x < minX ? point.x : minX;
      minY = point.y < minY ? point.y : minY;
    });
  });

  nodes = nodes.map(node => ({
    ...node,
    x: node.x - minX,
    y: node.y - minY,
  }));

  edges = edges.map(edge => ({
    ...edge,
    points: edge.points.map(({ x, y }) => ({
      x: x - minX,
      y: y - minY,
    })),
  }));

  return { nodes, edges };
}
