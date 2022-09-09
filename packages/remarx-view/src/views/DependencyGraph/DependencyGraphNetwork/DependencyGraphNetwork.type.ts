export interface FileDep {
  filePath: string;
  depPaths: Array<string>;
}

export interface GraphNode {
  id: string;
  name: string;
  symbolSize: number;
  x: number;
  y: number;
  value: number;
  category?: string;
  label?: {
    show?: boolean;
  };
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphCategory {
  name: string;
}

export interface Graph {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
  cates: Array<GraphCategory>;
}
