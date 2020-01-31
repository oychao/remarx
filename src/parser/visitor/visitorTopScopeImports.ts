import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  JSXIdentifier,
  JSXMemberExpression,
  MemberExpression,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { startWithCapitalLetter } from '../../utils';
import { LogicProgramCommon } from '../node/logicProgramCommon';
import { LogicTopScope, TopScopeDepend, TopScopeMap } from '../node/logicTopScope';
import { SelectorHandlerMap, Visitor } from './visitor';

export class VisitorTopScopeImports extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[];

  private currWorkingScope: LogicTopScope | undefined;

  constructor(program: LogicProgramCommon) {
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
        selector: [AST_NODE_TYPES.CallExpression],
        handler: this.handleCPath,
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

  /**
   * handler patterns:
   * const foo = () => {};
   * const foo = function () {};
   * function foo () {}
   */
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

    if (
      (startWithCapitalLetter(functionName) || functionName.slice(0, 3) === 'use') &&
      this.program.localScopes[functionName] instanceof LogicTopScope
    ) {
      this.currWorkingScope = this.program.localScopes[functionName] as LogicTopScope;
    }
  }

  /**
   * handle pattern:
   * useFoo();
   * Foo.useFoo();
   */
  private async handleCPath(path: any[], node: CallExpression): Promise<void> {
    const nodes: MemberExpression[] = [];
    let currCallee = node.callee as MemberExpression | Identifier;
    while (AST_NODE_TYPES.MemberExpression === currCallee.type) {
      nodes.push(currCallee);
      currCallee = currCallee.object as MemberExpression | Identifier;
    }
    const parent = nodes.pop();

    if (this.currWorkingScope) {
      if (parent) {
        const callerName: string = (parent.object as Identifier).name as string;
        const scopeName: string = (parent.property as Identifier).name as string;
        if (scopeName.slice(0, 3) === 'use') {
          const targetProgram: TopScopeDepend = this.program.imports[callerName] as TopScopeDepend;
          this.currWorkingScope.scopeDepMap[scopeName] =
            typeof targetProgram === 'object'
              ? (this.program.imports[callerName] as TopScopeMap)[scopeName]
              : `${targetProgram}#${scopeName}`;
        }
      } else {
        const scopeName: string = currCallee.name as string;
        if (scopeName.slice(0, 3) === 'use') {
          this.currWorkingScope.scopeDepMap[scopeName] = this.program.imports[scopeName];
        }
      }
    }
  }

  /**
   * handle pattern:
   * <MyComp />
   */
  private async handleJJJPath(path: any[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(scopeName)) {
      this.currWorkingScope.scopeDepMap[scopeName] = this.program.imports[scopeName];
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
    const scopeName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(scopeName)) {
      this.currWorkingScope.scopeDepMap[scopeName] = this.program.imports[scopeName];
    }
  }
}
