import produce from 'immer';
import * as React from 'react';

export const StoreContext = React.createContext<{
  data: typeof window.graphData;
  initMessage: string[];

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
let globalAppendInitMessage: React.Dispatch<React.SetStateAction<string>> = null;
let globalSetInitMessage: React.Dispatch<React.SetStateAction<string[]>> = null;
let globalSetData: React.Dispatch<React.SetStateAction<GraphData>> = null;

export function useStore() {
  return React.useContext(StoreContext);
}

window.addEventListener('message', (event) => {
  const action = event.data;
  switch (action.type) {
    case 'UPDATE_GRAPH':
      globalSetData(action.payload);
      globalSetInitMessage([]);
      break;
    case 'SET_INIT_MESSAGE':
      globalAppendInitMessage(action.payload);
      globalSetData(null);
      break;
    default:
      break;
  }
});

export function Provider({ children }: ProviderProps): JSX.Element {
  // state will exposed to code
  const [data, setData] = React.useState<GraphData>(null);
  const [initMessage, setInitMessage] = React.useState<string[]>([]);

  const [curNode, setCurNode] = React.useState<dagre.Node<{ label: string; detail: any }>>(null);
  const [mainView, setMainView] = React.useState(0);

  globalSetData = setData;
  globalSetInitMessage = setInitMessage;
  globalAppendInitMessage = (message: string) =>
    setInitMessage(
      produce(initMessage, (draft) => {
        draft.push(message);
      })
    );

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
