import * as React from 'react';

import { DepGraph } from 'comps/DepGraph';
import { data } from 'store/index';

import './style.less';

export function App() {
  return (
    <div className='app'>
      <DepGraph graphModel={data.default.fileGraphData} />
      <DepGraph graphModel={data.default.topScopeGraphData} />
    </div>
  );
}
