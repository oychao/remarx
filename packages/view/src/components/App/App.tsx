import * as React from 'react';

import { useStore } from '../../store/index';
import { CompDepGraph } from '../DepGraph/CompDepGraph';
import { FileDepGraph } from '../DepGraph/FileDepGraph';
import { Detail } from '../Detail';
import { Header } from './Header';
import { useFoo } from './useFoo';

import './style.less';

const useBar = function() {
  React.useState();
};

export function App() {
  useFoo();
  useBar();

  const { mainView } = useStore();

  const selectedView = React.useMemo(() => {
    const options = [<FileDepGraph />, <CompDepGraph />];
    return options[mainView];
  }, [mainView]);

  return (
    <div className='app'>
      <Header />
      <main className='app_main'>{selectedView}</main>
      <footer className='app_footer'>
        <Detail />
      </footer>
    </div>
  );
}
