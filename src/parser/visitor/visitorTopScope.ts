import { Visitor } from './visitor';
import { ConcreteNode } from '../node/astNode';
import { NodeBlockStatementVisitable, AstType } from '../node/astTypes';

export class VisitorTopScope extends Visitor implements NodeBlockStatementVisitable {
  public hookMap: { [key: string]: ConcreteNode } = {};

  public compMap: { [key: string]: ConcreteNode } = {};

  public async visitBlockStatement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    for (let i = 0, len = astPath.length - 1; i < len; i++) {
      const astAncestor = astPath[i];
      // it's not a top block scope
      if (astAncestor.type === AstType.BlockStatement) {
        return;
      }
    }

    const len = astPath.length;
    const parent = astPath[len - 2];
    const grantParent = astPath[len - 3];

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

    // console.log(astPath.map(node => node.type).join('->'));
    // console.log(functionName);

    const charCode = functionName.charCodeAt(0);
    if (charCode < 91 && charCode > 64) {
      this.compMap[functionName] = astNode;
    } else if (functionName.slice(0, 3) === 'use') {
      this.hookMap[functionName] = astNode;
    }
  }
}
