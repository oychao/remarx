// import * as dataJson from './data.json';

// export const data = (dataJson as unknown) as { default: { fileGraphData: GraphView; topScopeGraphData: GraphView } };

export function useDepGraph() {
  return window.graphData;
}
