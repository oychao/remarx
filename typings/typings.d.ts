declare interface GraphView {
  nodes: dagre.Node[];
  edges: dagre.GraphEdge[];
}

// file dependency dag
declare interface FileDependencyDag {
  files: string[];
  dependencies: [string, string][];
}

declare namespace JSX {
  export interface Element {}
  export interface IntrinsicElements {
    div: any;
  }
}
