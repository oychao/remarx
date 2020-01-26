import { ConcreteNode } from '../node/astNode';
import { NodeBlockStatementVisitable, AstType } from '../node/astTypes';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap } from './visitor';

export class VisitorTopScope extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[];

  public hookMap: { [key: string]: ConcreteNode } = {};

  public compMap: { [key: string]: ConcreteNode } = {};

  constructor(program: Program) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.BlockStatement],
        handler: this.visitBlockStatement,
      },
    ];
  }

  public async visitBlockStatement(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    for (let i = 0, len = path.length - 1; i < len; i++) {
      const astAncestor = path[i];
      // it's not a top block scope
      if (astAncestor.type === AstType.BlockStatement) {
        return;
      }
    }

    const len = path.length;
    const parent = path[len - 2];
    const grantParent = path[len - 3];

    // like `const foo = () => {};` or `const foo = function () {};`
    const isVariableDeclaration =
      (parent.type === AstType.ArrowFunctionExpression || parent.type === AstType.FunctionExpression) &&
      grantParent.type === AstType.VariableDeclarator;

    // like `function foo () {}`
    const isFunctionDeclaration = parent.type === AstType.FunctionDeclaration;

    // not our target scope if not a function scope
    if (!isVariableDeclaration && !isFunctionDeclaration) {
      return;
    }

    let functionName = '';
    if (isFunctionDeclaration) {
      functionName = parent?.id?.name as string;
    } else if (isVariableDeclaration) {
      functionName = grantParent?.id?.name as string;
    }

    // console.log(path.map(node => node.type).join('->'));
    // console.log(functionName);

    const charCode = functionName.charCodeAt(0);
    if (charCode < 91 && charCode > 64) {
      this.compMap[functionName] = node;
    } else if (functionName.slice(0, 3) === 'use') {
      this.hookMap[functionName] = node;
    }
  }
}
