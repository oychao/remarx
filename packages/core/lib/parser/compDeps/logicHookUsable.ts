import { ExtendedNode } from '../astNodes/extendedNode';
import { LogicProgramCommon } from '../programs/logicProgramCommon';
import { LogicAbstractDepNode } from './logicAbstractDepNode';

export abstract class LogicHookUsableClass extends LogicAbstractDepNode {
  constructor(name: string, astNode: ExtendedNode<LogicAbstractDepNode>, program: LogicProgramCommon) {
    super(name, astNode, program);
  }
}
