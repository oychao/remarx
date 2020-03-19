import * as React from 'react';

import { openFile } from 'src/services';
import { startWithCapitalLetter } from 'src/utils';
import { useDepGraph } from 'store/index';
import { DepGraph } from '../DepGraph';
import { NodeStyle } from '../DepGraph/DepNode';
import { Detail } from '../Detail';
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
  useFoo();
  useBar();

  const data = useDepGraph();

  const handleFileDepNodeClick = React.useCallback((node: dagre.Node) => {
    openFile(node.label.split('#')[0]);
  }, []);

  const [curNode, setCurNode] = React.useState<dagre.Node>(null);
  const handleCompNodeClick = React.useCallback((node: dagre.Node) => {
    setCurNode(node);
  }, []);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectedView = React.useMemo(() => {
    const options = [
      <DepGraph
        graphModel={data.fileGraphData}
        determineStyle={determineFileStyle}
        onNodeClick={handleFileDepNodeClick}
      />,
      <DepGraph
        graphModel={data.topScopeGraphData}
        determineStyle={determineTopScopeStyle}
        onNodeClick={handleCompNodeClick}
      />,
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
      <main className='app_main'>{selectedView}</main>
      <footer className='app_footer'>
        <Detail node={curNode} />
      </footer>
    </div>
  );
}
