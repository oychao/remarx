import { ConcreteNode } from '../node/concreteNode';
import { AstType } from '../node/astTypes';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap } from './visitor';

export class VisitorReactDom extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  public compTagNames: Set<string> = new Set();

  constructor(program: Program) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.JSXIdentifier],
        handler: this.visitJPath,
      },
    ];
  }

  private async visitJPath(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    const charCode = (node.name as string).charCodeAt(0);
    if (charCode < 91 && charCode > 64) {
      this.compTagNames.add(node.name as string);
    }
  }
}
