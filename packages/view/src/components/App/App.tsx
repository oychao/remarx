import * as React from 'react';

import { useStore } from '../../store/index';
import { CompDepGraph } from '../DepGraph/CompDepGraph';
import { FileDepGraph } from '../DepGraph/FileDepGraph';
import { Detail } from '../Detail';
import { Header } from './Header';

import './style.less';

export function App() {
  const ref = React.useRef<HTMLDivElement>();

  const { initMessage, data, mainView } = useStore();

  const selectedView = React.useMemo(() => {
    const options = [<FileDepGraph />, <CompDepGraph />];
    return options[mainView];
  }, [mainView]);

  React.useEffect(() => {
    if (data) {
      ref.current.scrollTop = 0;
    } else {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [data, initMessage]);

  return (
    <div className='app'>
      <Header />
      <main className='app_main' ref={ref}>
        {data ? selectedView : initMessage.map((msg, idx) => <div key={idx}>{msg}</div>)}
      </main>
      <footer className='app_footer'>
        <Detail />
      </footer>
    </div>
  );
}
