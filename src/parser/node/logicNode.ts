import { ImplementedNode } from './implementedNode';

export abstract class LogicNode {
  protected abstract astNode: ImplementedNode | undefined;
}
