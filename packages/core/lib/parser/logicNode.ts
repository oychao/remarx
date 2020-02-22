import { ImplementedNode } from './implementedNode';
import { LogicAbstractNode } from './logicAbstractNode';

export class LogicNode extends LogicAbstractNode {
  protected astNode: ImplementedNode<LogicAbstractNode> | undefined;

  constructor(astNode: ImplementedNode) {
    super();
    this.astNode = astNode;
    astNode.logicNode = this;
  }
}
