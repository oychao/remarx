declare function acquireVsCodeApi(): { postMessage: (message: object) => void };

declare type DepNodeModel = { label: string; width: number; height: number; x: number; y: number };

declare type DepPointModel = { x: number; y: number };

declare type DepEdgeModel = { points: DepPointModel[] };

declare type DepGraphModel = {
  nodes: DepNodeModel[];
  edges: DepEdgeModel[];
};

// const vscode = acquireVsCodeApi();
// vscode.postMessage({
//   foo: 'test',
// });
