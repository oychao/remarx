import { ConcreteNode } from '../node/astNode';
import { NodeJSXIdentifierVisitable } from '../node/astTypes';
import { Visitor } from './visitor';

export class VisitorReactDom extends Visitor implements NodeJSXIdentifierVisitable {
  public tagNames: Set<string> = new Set();

  public async visitJSXIdentifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    this.tagNames.add(astNode.name as string);
  }
}
