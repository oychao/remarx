import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ArrowFunctionExpression,
  BlockStatement,
  FunctionDeclaration,
  FunctionExpression,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { startWithCapitalLetter } from '../utils';
import { BaseNodeDescendant } from '../parser/astNodes/extendedNode';
import { TopScopeMap } from '../parser/compDeps/logicAbstractDepNode';
import { LogicFunctionComponent } from '../parser/compDeps/logicFunctionComponent';
import { LogicHook } from '../parser/compDeps/logicHook';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';

export class LocalScopeProvider extends DepPlugin {
  // local scopes
  public localScopes: TopScopeMap = {};

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
  protected async scanLocalScope(
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

    if (startWithCapitalLetter(functionName)) {
      this.localScopes[functionName] = new LogicFunctionComponent(
        functionName,
        node as BaseNodeDescendant,
        this.program
      );
    } else if (functionName.slice(0, 3) === 'use') {
      this.localScopes[functionName] = new LogicHook(functionName, node as BaseNodeDescendant, this.program);
    }

    // if (startWithCapitalLetter(functionName) || functionName.slice(0, 3) === 'use') {
    // }
  }
}
