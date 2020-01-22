import * as React from 'react';
import produce from 'immer';

export const ACTION_UPDATE_CREATING_FORM = 'ACTION_UPDATE_CREATING_FORM';
export const ACTION_CREATE = 'ACTION_CREATE';
export const ACTION_SET_EDITING_PRODUCT = 'ACTION_SET_EDITING_PRODUCT';
export const ACTION_UPDATE_EDITING_FORM = 'ACTION_UPDATE_EDITING_FORM';
export const ACTION_EDIT = 'ACTION_EDIT';
export const ACTION_DELETE = 'ACTION_DELETE';

export const StoreDispatchContext = React.createContext<{
  store: Store.StoreState;
  dispatch: React.Dispatch<Store.ReducerAction>;
}>(null);

export const initialState: Store.StoreState = {
  creatingForm: {
    name: '',
    price: 0,
  },
  editingForm: {
    id: -1,
    name: '',
    price: 0,
  },
  products: [
    {
      id: 0,
      name: 'keyboard',
      price: 650,
    },
  ],
};

let curMaxId: number = 0;

export const reducer = function(state: Store.StoreState, action: Store.ReducerAction): Store.StoreState {
  let index: number = null;
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_UPDATE_CREATING_FORM:
        draft.creatingForm = action.payload as Store.CreatingProductForm;
        break;
      case ACTION_CREATE:
        draft.products.push({ ...draft.creatingForm, id: ++curMaxId });
        draft.creatingForm = {
          name: '',
          price: 0,
        };
        break;
      case ACTION_SET_EDITING_PRODUCT:
        const target = {
          ...draft.products.find(product => product.id === (action as Store.ReducerAction<{ id: number }>).payload.id),
        };
        draft.editingForm = target;
        break;
      case ACTION_UPDATE_EDITING_FORM:
        draft.editingForm = action.payload as Store.Product;
        break;
      case ACTION_EDIT:
        index = draft.products.findIndex(product => product.id === draft.editingForm.id);
        draft.products.splice(index, 1, draft.editingForm);
        draft.editingForm = {
          id: -1,
          name: '',
          price: 0,
        };
        break;
      case ACTION_DELETE:
        index = draft.products.findIndex(
          product => product.id === (action as Store.ReducerAction<{ id: number }>).payload.id
        );
        draft.products.splice(index, 1);
        break;
      default:
        break;
    }
    return draft;
  });
};
