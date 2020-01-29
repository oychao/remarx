import * as React from 'react';

import { initialState, reducer, StoreDispatchContext } from '../../store';
import { CreateForm, EditForm } from '../Form';
import { List } from '../List';

import './style.less';

const App = () => {
  const [store, dispatch] = React.useReducer(reducer, initialState);

  const dispatchContextValue = React.useMemo(() => ({ store, dispatch }), [store]);

  return (
    <div>
      <StoreDispatchContext.Provider value={dispatchContextValue}>
        <CreateForm />
        <EditForm />
        <hr />
        <List />
      </StoreDispatchContext.Provider>
    </div>
  );
};

export default App;
