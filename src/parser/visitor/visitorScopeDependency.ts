import { ConcreteNode } from '../node/astNode';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap } from './visitor';
import { AstType } from '../node/astTypes';

export class VisitorScopeDependency extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  constructor(program: Program) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.VariableDeclarator, AstType.CallExpression, AstType.Identifier],
        handler: this.outputFunctionName,
      },
      {
        selector: [AstType.VariableDeclarator, AstType.CallExpression, AstType.MemberExpression, AstType.Identifier],
        handler: this.outputFunctionName,
      },
      // {
      //   selector: [AstType.BlockStatement, AstType.ExpressionStatement, AstType.CallExpression],
      //   handler: this.outputFunctionName,
      // },
    ];
  }

  private async outputFunctionName(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode): Promise<void> {
    if ((node.name as string).slice(0, 3) === 'use') {
      console.log(node.name);
    }
  }
}
