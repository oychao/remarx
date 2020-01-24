import { ConcreteNode } from '../node/astNode';
import { NodeJSXIdentifierVisitable } from '../node/astTypes';
import { Visitor } from './visitor';

export class VisitorReactDom extends Visitor implements NodeJSXIdentifierVisitable {
  public compTagNames: Set<string> = new Set();

  public async visitJSXIdentifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    const charCode = (astNode.name as string).charCodeAt(0);
    if (charCode < 91 && charCode > 64) {
      this.compTagNames.add(astNode.name as string);
    }
  }
}
