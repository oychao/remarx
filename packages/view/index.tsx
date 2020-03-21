import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './src/components/App';
import { Provider } from './src/store/index';

import './index.less';

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.querySelector('#app')
);
