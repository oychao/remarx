import { ConcreteNode } from '../node/concreteNode';
import { AstType } from '../node/astTypes';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap } from './visitor';
import { startWithCapitalLetter } from '../../utils';

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
    if (startWithCapitalLetter(node.name as string)) {
      this.compTagNames.add(node.name as string);
    }
  }
}
