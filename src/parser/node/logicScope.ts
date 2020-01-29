import { LogicNode } from './logicNode';
import { ImplementedScope } from './implementedScope';

export class LogicScope extends LogicNode {
  protected astNode: ImplementedScope;

  constructor(astNode: ImplementedScope) {
    super();
    this.astNode = astNode;
  }
}
