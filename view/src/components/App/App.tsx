import * as React from 'react';

import { DepGraph } from 'comps/DepGraph';
import { NodeStyle } from 'comps/DepGraph/DepNode';
import { startWithCapitalLetter } from 'src/utils';
import { data } from 'store/index';

import './style.less';

function determineTopScopeStyle(node: DepNodeModel): NodeStyle {
  const lastFlag = node.label.split('#').pop();
  if (startWithCapitalLetter(lastFlag)) {
    return {
      rectFill: 'lightblue',
      textFill: 'grey',
    };
  } else {
    return {
      rectFill: 'lightgreen',
      textFill: 'grey',
    };
  }
}

function determineFileStyle(node: DepNodeModel): NodeStyle {
  if (node.label.charAt(0) === '.') {
    return {
      rectFill: 'orange',
      textFill: 'grey',
    };
  } else {
    return {
      rectFill: 'pink',
      textFill: 'grey',
    };
  }
}

export function App() {
  return (
    <div className='app'>
      <DepGraph graphModel={data.default.fileGraphData} determineStyle={determineFileStyle} />
      <DepGraph graphModel={data.default.topScopeGraphData} determineStyle={determineTopScopeStyle} />
    </div>
  );
}
