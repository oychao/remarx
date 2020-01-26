import { AstType } from '../node/astTypes';
import { ConcreteNode } from '../node/concreteNode';
import { ScopeNodeMap, TopScope } from '../node/topScope';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap } from './visitor';

export class VisitorTopScope extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[];

  public hookMap: ScopeNodeMap = {};

  public compMap: ScopeNodeMap = {};

  private currWorkingScope: TopScope | null = null;

  constructor(program: Program) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.FunctionDeclaration, AstType.BlockStatement],
        handler: this.visitFBPath,
      },
      {
        selector: [AstType.VariableDeclarator, AstType.FunctionExpression, AstType.BlockStatement],
        handler: this.visitFBPath,
      },
      {
        selector: [AstType.VariableDeclarator, AstType.ArrowFunctionExpression, AstType.BlockStatement],
        handler: this.visitFBPath,
      },
      {
        selector: [AstType.VariableDeclarator, AstType.CallExpression, AstType.Identifier],
        handler: this.handleVCIPath,
      },
      {
        selector: [AstType.VariableDeclarator, AstType.CallExpression, AstType.MemberExpression, AstType.Identifier],
        handler: this.handleVCIPath,
      },
    ];
  }

  private async visitFBPath(
    path: ConcreteNode[],
    node: ConcreteNode,
    parent: ConcreteNode,
    grantParent: ConcreteNode
  ): Promise<void> {
    for (let i = 0, len = path.length - 1; i < len; i++) {
      const astAncestor = path[i];
      // it's not a top block scope
      if (astAncestor.type === AstType.BlockStatement) {
        return;
      }
    }

    // like `const foo = () => {};` or `const foo = function () {};`
    const isVariableDeclaration =
      parent.type === AstType.ArrowFunctionExpression || parent.type === AstType.FunctionExpression;

    // like `function foo () {}`
    const isFunctionDeclaration = parent.type === AstType.FunctionDeclaration;

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
      this.currWorkingScope = this.compMap[functionName] = new TopScope(functionName, node, this.program);
    } else if (functionName.slice(0, 3) === 'use') {
      this.currWorkingScope = this.hookMap[functionName] = new TopScope(functionName, node, this.program);
    }
  }

  private async handleVCIPath(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode): Promise<void> {
    if ((node.name as string).slice(0, 3) === 'use') {
      console.log(`${this.currWorkingScope?.name} depends on ${node.name}`);
    }
  }
}
