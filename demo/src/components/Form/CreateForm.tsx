import * as React from 'react';

import * as hooks from '../../hooks';
import { useToggle } from '../../hooks';
import { ACTION_CREATE, ACTION_UPDATE_CREATING_FORM, StoreDispatchContext } from '../../store';

/**
 * CreateForm Component
 */
export const CreateForm = () => {
  const { store, dispatch } = React.useContext(StoreDispatchContext);

  const [visible, show, hide] = hooks.useToggle();

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
      <button onClick={visible ? hide : show}>{visible ? 'hide form' : 'new'}</button>
      {visible ? (
        <>
          <h3>Create Product</h3>
          <div>
            <span>Product Name</span>
            <input
              type='text'
              value={store.creatingForm.name}
              placeholder='Please input product name'
              onChange={handleNameChange}
            />
          </div>
          <div>
            <span>Product Price</span>
            <input
              type='number'
              value={store.creatingForm.price}
              placeholder='Please input product price'
              onChange={handlePriceChange}
            />
          </div>
          <div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </>
      ) : null}
    </div>
  );
};
