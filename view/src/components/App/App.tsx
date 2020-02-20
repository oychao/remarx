import * as React from 'react';

import { DepGraph } from 'comps/DepGraph';
import { NodeStyle } from 'comps/DepGraph/DepNode';
import { openFile } from 'src/services';
import { startWithCapitalLetter } from 'src/utils';
import { data } from 'store/index';

import './style.less';

function determineTopScopeStyle(node: dagre.Node): NodeStyle {
  const lastFlag = node.label.split('#').pop();
  if (startWithCapitalLetter(lastFlag)) {
    return {
      rectFill: 'lightblue',
      textFill: 'blue',
    };
  } else {
    return {
      rectFill: 'lightgreen',
      textFill: 'blue',
    };
  }
}

function determineFileStyle(node: dagre.Node): NodeStyle {
  if (node.label.charAt(0) === '/') {
    return {
      rectFill: 'orange',
      textFill: 'blue',
    };
  } else {
    return {
      rectFill: 'pink',
      textFill: 'blue',
    };
  }
}

export function App() {
  const handleFileDepNodeClick = React.useCallback((path: string) => {
    openFile(path);
  }, []);

  return (
    <div className='app'>
      <DepGraph
        graphModel={data.default.fileGraphData}
        determineStyle={determineFileStyle}
        onNodeClick={handleFileDepNodeClick}
      />
      <DepGraph graphModel={data.default.topScopeGraphData} determineStyle={determineTopScopeStyle} />
    </div>
  );
}
