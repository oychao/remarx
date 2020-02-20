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
import { selector, Selector } from './selector';

export class SelectorTopScopeImports extends Selector {
  private currWorkingScope: LogicTopScope | undefined;

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  /**
   * handler patterns:
   * const foo = () => {};
   * const foo = function () {};
   * function foo () {}
   */
  @selector('f_dton > blk')
  @selector('v_dtor > f_exp > blk')
  @selector('v_dtor > af_exp > blk')
  protected async visitPath1(
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
  @selector('cl')
  protected async visitPath2(path: any[], node: CallExpression): Promise<void> {
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
  @selector('jsx_ele > jsx_o_ele > jsx_idt')
  protected async visitPath3(path: any[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(scopeName)) {
      this.currWorkingScope.scopeDepMap[scopeName] = this.program.imports[scopeName];
    }
  }

  /**
   * handle pattern:
   * <Common.MyComp />
   */
  @selector('jsx_ele > jsx_o_ele > jsx_mem_exp > jsx_idt')
  protected async visitPath4(path: any[], node: JSXIdentifier, parent: JSXMemberExpression): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const scopeName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(scopeName)) {
      this.currWorkingScope.scopeDepMap[scopeName] = this.program.imports[scopeName];
    }
  }
}
