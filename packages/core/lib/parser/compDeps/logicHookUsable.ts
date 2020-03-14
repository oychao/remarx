import { ExtendedNode } from '../astNodes/extendedNode';
import { LogicProgramCommon } from '../programs/logicProgramCommon';
import { LogicAbstractDepNode } from './logicAbstractDepNode';

class UseStateStruct {
  private list: Array<[string, string]>;
  private stateMap: { [key: string]: string };
  private setterMap: { [key: string]: string };

  constructor() {
    this.list = [];
    this.stateMap = {};
    this.setterMap = {};
  }

  public register<T>(useStateRetType: [string, string]): void {
    if (this.stateMap[useStateRetType[0]] || this.setterMap[useStateRetType[1]]) {
      return;
    }
    if (null === useStateRetType[0] && null === useStateRetType[1]) {
      return;
    }
    this.list.push(useStateRetType);
    if (useStateRetType[0]) {
      this.stateMap[useStateRetType[0]] = useStateRetType[1] || null;
    }
    if (useStateRetType[1]) {
      this.setterMap[useStateRetType[1]] = useStateRetType[0] || null;
    }
  }

  public getSetter(state: string): string {
    return this.stateMap[state];
  }

  public getState(setter: string): string {
    return this.setterMap[setter];
  }
}

export abstract class LogicHookUsableClass extends LogicAbstractDepNode {
  public useStateStore: UseStateStruct;

  constructor(name: string, astNode: ExtendedNode<LogicAbstractDepNode>, program: LogicProgramCommon) {
    super(name, astNode, program);
    this.useStateStore = new UseStateStruct();
  }
}
