// import * as dataJson from './data.json';

// export const data = (dataJson as unknown) as { default: { fileGraphData: GraphView; topScopeGraphData: GraphView } };

import * as React from 'react';

export const StoreContext = React.createContext<{
  data: typeof window.graphData;
  initMessage: string;

  curNode: dagre.Node<{ label: string; detail: any }>;
  setCurNode: (node: dagre.Node<{ label: string; detail: any }>) => void;
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
let globalSetInitMessage: React.Dispatch<React.SetStateAction<string>> = null;
let globalSetData: React.Dispatch<React.SetStateAction<GraphData>> = null;

export function useStore() {
  return React.useContext(StoreContext);
}

window.addEventListener('message', event => {
  const action = event.data;
  switch (action.type) {
    case 'UPDATE_GRAPH':
      globalSetData(action.payload);
      globalSetInitMessage(null);
      break;
    case 'SET_INIT_MESSAGE':
      globalSetInitMessage(action.payload);
      globalSetData(null);
      break;
    default:
      break;
  }
});

export function Provider({ children }: ProviderProps): JSX.Element {
  // state will exposed to code
  const [data, setData] = React.useState<GraphData>(null);
  const [initMessage, setInitMessage] = React.useState<string>('analyzing');

  const [curNode, setCurNode] = React.useState<dagre.Node<{ label: string; detail: any }>>(null);
  const [mainView, setMainView] = React.useState(0);

  globalSetInitMessage = setInitMessage;
  globalSetData = setData;

  return (
    <StoreContext.Provider
      value={{
        initMessage,
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
