import * as React from 'react';

import { StoreDispatchContext, ACTION_UPDATE_CREATING_FORM, ACTION_CREATE } from '../../store';

/**
 * CreateForm Component
 */
export const CreateForm = () => {
  const { store, dispatch } = React.useContext(StoreDispatchContext);

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ACTION_UPDATE_CREATING_FORM,
        payload: {
          ...store.creatingForm,
          name: e.target.value,
        },
      });
    },
    [store.creatingForm]
  );

  const handlePriceChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ACTION_UPDATE_CREATING_FORM,
        payload: {
          ...store.creatingForm,
          price: e.target.value,
        },
      });
    },
    [store.creatingForm]
  );

  const handleSubmit = React.useCallback(() => {
    dispatch({
      type: ACTION_CREATE,
    });
  }, []);

  return (
    <div>
      <input
        type='text'
        value={store.creatingForm.name}
        placeholder='Please input product name'
        onChange={handleNameChange}
      />
      <input
        type='number'
        value={store.creatingForm.price}
        placeholder='Please input product price'
        onChange={handlePriceChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
