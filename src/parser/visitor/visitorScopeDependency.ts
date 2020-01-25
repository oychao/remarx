import { ConcreteNode } from '../node/astNode';
import { NodeCallExpressionVisitable } from '../node/astTypes';
import { Visitor } from './visitor';

export class VisitorScopeDependency extends Visitor implements NodeCallExpressionVisitable {
  public async visitCallExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
