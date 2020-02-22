declare function acquireVsCodeApi(): { postMessage: (message: object) => void };

declare interface GraphView {
  nodes: string[];
  dependencies: [string, string][];
}

declare interface DAGraphView {
  nodes: dagre.Node[];
  edges: dagre.GraphEdge[];
}
