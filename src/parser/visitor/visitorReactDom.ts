import { startWithCapitalLetter } from '../../utils';
import { ConcreteNode } from '../node/concreteNode';
import { AstType } from '../node/astTypes';
import { ScopeNodeMap } from '../node/topScope';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap } from './visitor';

export class VisitorReactDom extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  public compDepMap: ScopeNodeMap = {};

  constructor(program: Program) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.JSXElement, AstType.JSXOpeningElement, AstType.JSXIdentifier],
        handler: this.handleJJJPath,
      },
      {
        selector: [AstType.JSXElement, AstType.JSXOpeningElement, AstType.JSXMemberExpression, AstType.JSXIdentifier],
        handler: this.handleJJJJPath,
      },
    ];
  }

  private async handleJJJPath(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    const compName: string = node.name as string;
    if (startWithCapitalLetter(compName)) {
      this.compDepMap[compName] = this.program.visitorFileDependency.identifierDepMap[
        compName
      ]?.visitorTopScope.compMap[compName];
    }
  }

  private async handleJJJJPath(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const compName: string = node.name as string;
    if (startWithCapitalLetter(compName)) {
      this.compDepMap[compName] = this.program.visitorFileDependency.identifierDepMap[
        parent.object?.name as string
      ]?.visitorTopScope.compMap[compName];
    }
  }
}
