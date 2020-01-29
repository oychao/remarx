import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  BlockStatement,
  FunctionDeclaration,
  ArrowFunctionExpression,
  FunctionExpression,
  Identifier,
  MemberExpression,
  JSXIdentifier,
  JSXMemberExpression,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { startWithCapitalLetter } from '../../utils';
import { ScopeNodeMap, TopScope } from '../node/topScope';
import { Program } from '../program';
import { Visitor, SelectorHandlerMap, BaseNodeDescendant } from './visitor';

export class VisitorTopScope extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[];

  public hookMap: ScopeNodeMap = {};

  public compMap: ScopeNodeMap = {};

  private currWorkingScope: TopScope | undefined;

  constructor(program: Program) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AST_NODE_TYPES.FunctionDeclaration, AST_NODE_TYPES.BlockStatement],
        handler: this.visitFBPath,
      },
      {
        selector: [AST_NODE_TYPES.VariableDeclarator, AST_NODE_TYPES.FunctionExpression, AST_NODE_TYPES.BlockStatement],
        handler: this.visitFBPath,
      },
      {
        selector: [
          AST_NODE_TYPES.VariableDeclarator,
          AST_NODE_TYPES.ArrowFunctionExpression,
          AST_NODE_TYPES.BlockStatement,
        ],
        handler: this.visitFBPath,
      },
      {
        selector: [AST_NODE_TYPES.VariableDeclarator, AST_NODE_TYPES.CallExpression, AST_NODE_TYPES.Identifier],
        handler: this.handleVCIPath,
      },
      {
        selector: [
          AST_NODE_TYPES.VariableDeclarator,
          AST_NODE_TYPES.CallExpression,
          AST_NODE_TYPES.MemberExpression,
          AST_NODE_TYPES.Identifier,
        ],
        handler: this.handleVCMIPath,
      },
      {
        selector: [AST_NODE_TYPES.JSXElement, AST_NODE_TYPES.JSXOpeningElement, AST_NODE_TYPES.JSXIdentifier],
        handler: this.handleJJJPath,
      },
      {
        selector: [
          AST_NODE_TYPES.JSXElement,
          AST_NODE_TYPES.JSXOpeningElement,
          AST_NODE_TYPES.JSXMemberExpression,
          AST_NODE_TYPES.JSXIdentifier,
        ],
        handler: this.handleJJJJPath,
      },
    ];
  }

  private async visitFBPath(
    path: any[],
    node: BlockStatement,
    parent: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
    grantParent: any
  ): Promise<void> {
    for (let i = 0, len = path.length - 1; i < len; i++) {
      const astAncestor = path[i];
      // it's not a top block scope
      if (astAncestor.type === AST_NODE_TYPES.BlockStatement) {
        return;
      }
    }

    // like `const foo = () => {};` or `const foo = function () {};`
    const isVariableDeclaration =
      parent.type === AST_NODE_TYPES.ArrowFunctionExpression || parent.type === AST_NODE_TYPES.FunctionExpression;

    // like `function foo () {}`
    const isFunctionDeclaration = parent.type === AST_NODE_TYPES.FunctionDeclaration;

    let functionName = '';
    if (isFunctionDeclaration) {
      functionName = parent?.id?.name as string;
    } else if (isVariableDeclaration) {
      functionName = grantParent?.id?.name as string;
    }

    // console.log(path.map(node => node.type).join('->'));
    // console.log(functionName);

    if (startWithCapitalLetter(functionName)) {
      this.currWorkingScope = this.compMap[functionName] = new TopScope(
        functionName,
        node as BaseNodeDescendant,
        this.program
      );
    } else if (functionName.slice(0, 3) === 'use') {
      this.currWorkingScope = this.hookMap[functionName] = new TopScope(
        functionName,
        node as BaseNodeDescendant,
        this.program
      );
    }
  }

  /**
   * handle pattern:
   * useFoo();
   */
  private async handleVCIPath(path: any[], node: Identifier): Promise<void> {
    const hookName: string = node.name as string;
    if (this.currWorkingScope && hookName.slice(0, 3) === 'use') {
      this.currWorkingScope.hookDepMap[hookName] = this.program.visitorFileDependency.identifierDepMap[
        hookName
      ]?.visitorFileDependency.exports[hookName];
    }
  }

  /**
   * handle pattern:
   * Foo.useBar();
   */
  private async handleVCMIPath(path: any[], node: Identifier, parent: MemberExpression): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const hookName: string = node.name as string;
    if (this.currWorkingScope && hookName.slice(0, 3) === 'use') {
      this.currWorkingScope.hookDepMap[hookName] = this.program.visitorFileDependency.identifierDepMap[
        (parent.object as Identifier)?.name as string
      ]?.visitorFileDependency.exports[hookName];
    }
  }

  /**
   * handle pattern:
   * <MyComp />
   */
  private async handleJJJPath(path: any[], node: JSXIdentifier): Promise<void> {
    const compName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(compName)) {
      this.currWorkingScope.compDepMap[compName] = this.program.visitorFileDependency.identifierDepMap[
        compName
      ]?.visitorFileDependency.exports[compName];
    }
  }

  /**
   * handle pattern:
   * <Common.MyComp />
   */
  private async handleJJJJPath(path: any[], node: JSXIdentifier, parent: JSXMemberExpression): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const compName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(compName)) {
      this.currWorkingScope.compDepMap[compName] = this.program.visitorFileDependency.identifierDepMap[
        (parent.object as JSXIdentifier)?.name as string
      ]?.visitorFileDependency.exports[compName];
    }
  }
}
