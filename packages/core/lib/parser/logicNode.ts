import { ExtendedNode } from './astNodes/extendedNode';
import { LogicAbstractNode } from './logicAbstractNode';

export class LogicNode extends LogicAbstractNode {
  protected astNode: ExtendedNode<LogicAbstractNode> | undefined;

  constructor(astNode: ExtendedNode) {
    super();
    this.astNode = astNode;
    astNode.logicNode = this;
  }
}
