// import * as dataJson from './data.json';

// export const data = (dataJson as unknown) as { default: { fileGraphData: GraphView; topScopeGraphData: GraphView } };

import * as React from 'react';

export const StoreContext = React.createContext<{
  data: typeof window.graphData;
  curNode: dagre.Node;
  setCurNode: (node: dagre.Node) => void;
}>(null);

interface ProviderProps {
  children: JSX.Element;
}

export function useStore() {
  return React.useContext(StoreContext);
}

export function Provider({ children }: ProviderProps): JSX.Element {
  const [curNode, setCurNode] = React.useState<dagre.Node>(null);

  return (
    <StoreContext.Provider
      value={{
        data: window.graphData,
        curNode,
        setCurNode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
