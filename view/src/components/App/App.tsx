import * as React from 'react';

import { data } from 'store/index';

import './style.less';

export function App() {
  return <div className='app'>{JSON.stringify(data, null, 2)}</div>;
}
