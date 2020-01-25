import * as React from 'react';
export declare const ACTION_UPDATE_CREATING_FORM = "ACTION_UPDATE_CREATING_FORM";
export declare const ACTION_CREATE = "ACTION_CREATE";
export declare const ACTION_SET_EDITING_PRODUCT = "ACTION_SET_EDITING_PRODUCT";
export declare const ACTION_UPDATE_EDITING_FORM = "ACTION_UPDATE_EDITING_FORM";
export declare const ACTION_EDIT = "ACTION_EDIT";
export declare const ACTION_DELETE = "ACTION_DELETE";
export declare const StoreDispatchContext: React.Context<{
    store: Store.StoreState;
    dispatch: React.Dispatch<Store.ReducerAction<unknown>>;
}>;
export declare const initialState: Store.StoreState;
export declare const reducer: (state: Store.StoreState, action: Store.ReducerAction<unknown>) => Store.StoreState;
