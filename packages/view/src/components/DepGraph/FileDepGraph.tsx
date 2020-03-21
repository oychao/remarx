import * as React from 'react';

import { openFile } from 'src/services';
import { useStore } from '../../store/index';
import { DepGraph } from './DepGraph';
import { NodeStyle } from './DepNode';

function determineFileStyle(node: dagre.Node): NodeStyle {
  if (node.label.charAt(0) === '/') {
    return {
      rectFill: 'orange',
      textFill: '#555',
    };
  } else {
    return {
      rectFill: 'pink',
      textFill: '#555',
    };
  }
}

export function FileDepGraph(): JSX.Element {
  const {
    data: { fileGraphData },
  } = useStore();

  const handleFileDepNodeClick = React.useCallback((node: dagre.Node) => {
    openFile(node.label.split('#')[0]);
  }, []);

  return (
    <DepGraph graphModel={fileGraphData} determineStyle={determineFileStyle} onNodeClick={handleFileDepNodeClick} />
  );
}
