// declare module '*.svg' {
//   const content: any;
//   export default content;
// }

declare namespace Store {
  export interface Product {
    id: number;
    name: string;
    price: number;
  }

  export type CreatingProductForm = Omit<Product, 'id'>;

  export interface StoreState {
    creatingForm: CreatingProductForm;
    editingForm: Product;
    products: Product[];
  }

  export interface ReducerAction<T = unknown> {
    type: string;
    payload?: T;
  }
}
