declare interface GraphView {
  nodes: dagre.Node[];
  edges: dagre.GraphEdge[];
}

// file dependency dag
declare interface FileDependencyDag {
  files: string[];
  dependencies: [string, string][];
}

declare enum TopScopeType {
  HOOK = 'HOOK',
  COMPONENT = 'COMPONENT',
}

declare interface TopScopeNode {
  file: string;
  name: string;
  type: TopScopeType;
}

// top scope dependency dag
declare interface TopScopeDependencyDag {
  scopes: TopScopeNode[];
  dependencies: [TopScopeNode, TopScopeNode][];
}

declare namespace JSX {
  export interface Element {}
  export interface IntrinsicElements {
    div: any;
  }
}
