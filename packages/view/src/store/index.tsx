// import * as dataJson from './data.json';

// export const data = (dataJson as unknown) as { default: { fileGraphData: GraphView; topScopeGraphData: GraphView } };

import * as React from 'react';

export const StoreContext = React.createContext<{
  data: typeof window.graphData;
  analyzing: boolean;

  curNode: dagre.Node;
  setCurNode: (node: dagre.Node) => void;
  mainView: number;
  setMainView: (num: number) => void;
}>(null);

interface ProviderProps {
  children: JSX.Element;
}

interface GraphData {
  fileGraphData: GraphView;
  topScopeGraphData: GraphView;
}

// global interfaces
let globalSetAnalyzing: React.Dispatch<React.SetStateAction<boolean>> = null;
let globalSetData: React.Dispatch<React.SetStateAction<GraphData>> = null;

export function useStore() {
  return React.useContext(StoreContext);
}

window.addEventListener('message', event => {
  const action = event.data;
  switch (action.type) {
    case 'UPDATE_GRAPH':
      globalSetData(action.payload);
      globalSetAnalyzing(false);
      break;
    case 'START_ANALYZING':
      globalSetAnalyzing(true);
      globalSetData(null);
      break;
    default:
      break;
  }
});

export function Provider({ children }: ProviderProps): JSX.Element {
  // state will exposed to code
  const [data, setData] = React.useState<GraphData>(null);
  const [analyzing, setAnalyzing] = React.useState<boolean>(true);

  const [curNode, setCurNode] = React.useState<dagre.Node>(null);
  const [mainView, setMainView] = React.useState(0);

  globalSetAnalyzing = setAnalyzing;
  globalSetData = setData;

  return (
    <StoreContext.Provider
      value={{
        analyzing,
        data,
        curNode,
        setCurNode,
        mainView,
        setMainView,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
