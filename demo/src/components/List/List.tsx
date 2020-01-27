import * as React from 'react';

import { StoreDispatchContext, ACTION_SET_EDITING_PRODUCT, ACTION_DELETE } from '../../store';
import * as Common from '../../common';

/**
 * List Component
 */
export const List = () => {
  const { store, dispatch } = React.useContext(StoreDispatchContext);

  return (
    <table>
      <thead>
        <tr>
          <th>
            <Common.MyDiv />
            <span>ID</span>
          </th>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {store.products.map(({ id, name, price }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{price}</td>
            <td>
              <button
                onClick={() =>
                  dispatch({
                    type: ACTION_SET_EDITING_PRODUCT,
                    payload: { id },
                  })
                }
              >
                Edit
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: ACTION_DELETE,
                    payload: { id },
                  })
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
