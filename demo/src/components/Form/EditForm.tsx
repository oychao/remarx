import * as React from 'react';

import { ACTION_EDIT, ACTION_UPDATE_EDITING_FORM, StoreDispatchContext } from '../../store';

/**
 * EditForm Component
 */
export function EditForm() {
  const { store, dispatch } = React.useContext(StoreDispatchContext);

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ACTION_UPDATE_EDITING_FORM,
        payload: {
          ...store.editingForm,
          name: e.target.value,
        },
      });
    },
    [store.editingForm]
  );

  const handlePriceChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: ACTION_UPDATE_EDITING_FORM,
        payload: {
          ...store.editingForm,
          price: e.target.value,
        },
      });
    },
    [store.editingForm]
  );

  const handleSubmit = React.useCallback(() => {
    dispatch({
      type: ACTION_EDIT,
    });
  }, []);

  return (
    <div>
      <h3>Edit Product</h3>
      <div>
        <span>Product Name</span>
        <input
          type='text'
          value={store.editingForm.name}
          placeholder='Please input product name'
          onChange={handleNameChange}
        />
      </div>
      <div>
        <span>Product Price</span>
        <input
          type='number'
          value={store.editingForm.price}
          placeholder='Please input product price'
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
