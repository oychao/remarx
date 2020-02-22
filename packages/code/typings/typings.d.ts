declare interface GraphView {
  nodes: string[];
  dependencies: [string, string][];
}

declare namespace JSX {
  export interface Element {}
  export interface IntrinsicElements {
    div: any;
  }
}

declare interface ViewAction {
  action: string;
  payload: any;
}

declare interface Type<T> extends Function {
  new (...args: any[]): T;
}
