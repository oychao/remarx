import { ImplementedScope } from './implementedScope';
import { LogicNode } from './logicNode';

export class LogicScope extends LogicNode {
  constructor(astNode: ImplementedScope) {
    super(astNode);
  }
}
