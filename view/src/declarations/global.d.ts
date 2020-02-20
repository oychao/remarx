export {};

declare global {
  interface Window {
    graphData: { fileGraphData: GraphView; topScopeGraphData: GraphView };
  }
}
