import * as React from 'react';

import { useStore } from '../../store/index';

export function Header(): JSX.Element {
  const { mainView, setMainView } = useStore();

  return (
    <header className='app__header'>
      <input
        id='select-index-1'
        type='radio'
        name='select-index'
        onChange={() => setMainView(0)}
        checked={0 === mainView}
      />
      <label htmlFor='select-index-1'>
        <h4>File Dependencies</h4>
      </label>
      <input
        id='select-index-2'
        type='radio'
        name='select-index'
        onChange={() => setMainView(1)}
        checked={1 === mainView}
      />
      <label htmlFor='select-index-2'>
        <h4>Component & Hook Dependencies</h4>
      </label>
    </header>
  );
}
