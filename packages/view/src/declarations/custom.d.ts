declare function acquireVsCodeApi(): { postMessage: (message: object) => void };

declare interface GraphView<T = any> {
  nodes: T;
  dependencies: [string, string][];
}

declare interface DAGraphView {
  nodes: dagre.Node[];
  edges: dagre.GraphEdge[];
  maxX?: number;
  maxY?: number;
}
