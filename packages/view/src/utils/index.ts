import * as dagre from 'dagre';

export const NODE_HALF_WIDTH = 50;
export const NODE_HALF_HEIGHT = 8;

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
    g.setNode(node, { label: node, width: NODE_HALF_WIDTH * 2, height: NODE_HALF_HEIGHT * 2, detail });
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

  let maxX = 0;
  let maxY = 0;

  nodes.forEach(node => {
    minX = node.x < minX ? node.x : minX;
    minY = node.y < minY ? node.y : minY;
    maxX = node.x > maxX ? node.x : maxX;
    maxY = node.y > maxY ? node.y : maxY;
  });

  edges.forEach(edge => {
    edge.points.forEach(point => {
      minX = point.x < minX ? point.x : minX;
      minY = point.y < minY ? point.y : minY;
      maxX = point.x > maxX ? point.x : maxX;
      maxY = point.y > maxY ? point.y : maxY;
    });
  });

  maxX -= minX;
  maxY -= minY;

  maxX += 200;
  maxY += 200;

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

  return { nodes, edges, maxX, maxY };
}
