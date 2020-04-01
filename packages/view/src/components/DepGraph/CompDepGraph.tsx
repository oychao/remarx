import * as React from 'react';

import { startWithCapitalLetter } from 'utils/index';
import { useStore } from '../../store/index';
import { DepGraph } from './DepGraph';
import { NodeStyle } from './DepNode';

function determineTopScopeStyle(node: dagre.Node): NodeStyle {
  const lastFlag = node.label.split('#').pop();
  if (startWithCapitalLetter(lastFlag)) {
    return {
      rectFill: 'lightblue',
      textFill: '#555',
    };
  } else {
    return {
      rectFill: 'lightgreen',
      textFill: '#555',
    };
  }
}

export function CompDepGraph(): JSX.Element {
  const {
    data: { topScopeGraphData },
    setCurNode,
  } = useStore();

  const handleCompNodeClick = React.useCallback((node: dagre.Node) => {
    setCurNode(node);
  }, []);

  return (
    <DepGraph
      graphModel={topScopeGraphData}
      determineStyle={determineTopScopeStyle}
      onNodeClick={handleCompNodeClick}
    />
  );
}
