import * as React from 'react';

import { DepGraph } from '../DepGraph';
import { NodeStyle } from '../DepGraph/DepNode';
import { openFile } from 'src/services';
import { startWithCapitalLetter } from 'src/utils';
import { data } from 'store/index';
import { Title } from './Title';
import { Counter } from './Counter';
import { useFoo } from './useFoo';

import './style.less';

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

const useBar = function() {
  React.useState();
};

export function App() {
  const handleFileDepNodeClick = React.useCallback((path: string) => {
    openFile(path);
  }, []);
  useFoo();
  useBar();

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectedView = React.useMemo(() => {
    const options = [
      <DepGraph
        graphModel={data.default.fileGraphData}
        determineStyle={determineFileStyle}
        onNodeClick={handleFileDepNodeClick}
      />,
      <DepGraph graphModel={data.default.topScopeGraphData} determineStyle={determineTopScopeStyle} />,
    ];
    return options[selectedIndex];
  }, [selectedIndex]);

  return (
    <div className='app'>
      <header className='app__header'>
        <input
          id='select-index-1'
          type='radio'
          name='select-index'
          onChange={() => setSelectedIndex(0)}
          checked={0 === selectedIndex}
        />
        <label htmlFor='select-index-1'>
          <Title title='File Dependencies' />
        </label>
        <br />
        <input
          id='select-index-2'
          type='radio'
          name='select-index'
          onChange={() => setSelectedIndex(1)}
          checked={1 === selectedIndex}
        />
        <label htmlFor='select-index-2'>
          <Title title='Component & Hook Dependencies' />
        </label>
      </header>
      <div className='app_main'>{selectedView}</div>
    </div>
  );
}
