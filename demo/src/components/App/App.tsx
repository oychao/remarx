import * as React from 'react';

import { initialState, reducer, StoreDispatchContext } from '../../store';
import { List } from '../List';
import { CreateForm } from '../CreateForm';

import './style.less';

export const App = () => {
  const [store, dispatch] = React.useReducer(reducer, initialState);

  const dispatchContextValue = React.useMemo(() => ({ store, dispatch }), [store]);

  return (
    <div>
      <StoreDispatchContext.Provider value={dispatchContextValue}>
        <CreateForm />
        <hr />
        <List />
      </StoreDispatchContext.Provider>
    </div>
  );
};
