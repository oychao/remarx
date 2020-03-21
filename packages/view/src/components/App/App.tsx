import * as React from 'react';

import { Detail } from '../Detail';
import { Title } from './Title';
import { useFoo } from './useFoo';

import { CompDepGraph } from '../DepGraph/CompDepGraph';
import { FileDepGraph } from '../DepGraph/FileDepGraph';

import './style.less';

const useBar = function() {
  React.useState();
};

export function App() {
  useFoo();
  useBar();

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const selectedView = React.useMemo(() => {
    const options = [<FileDepGraph />, <CompDepGraph />];
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
        <Detail />
      </footer>
    </div>
  );
}
