import * as React from 'react';

import { StoreDispatchContext } from '../../store';

/**
 * List Component
 */
export const List = () => {
  const { store } = React.useContext(StoreDispatchContext);
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {store.products.map(({ id, name, price }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
