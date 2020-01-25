declare interface GraphView {
  nodes: dagre.Node[];
  edges: dagre.GraphEdge[];
}

declare namespace JSX {
  export interface Element {}
  export interface IntrinsicElements {
    div: any;
  }
}
