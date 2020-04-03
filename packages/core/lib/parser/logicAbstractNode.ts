import { ExtendedNode } from './astNodes/extendedNode';

export abstract class LogicAbstractNode {
  protected abstract astNode: ExtendedNode | undefined;
}
