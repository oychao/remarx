import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ArrowFunctionExpression,
  BlockStatement,
  FunctionDeclaration,
  FunctionExpression,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { startWithCapitalLetter } from '../../utils';
import { BaseNodeDescendant } from '../node/implementedNode';
import { LogicProgramCommon } from '../node/logicProgramCommon';
import { LogicTopScope } from '../node/logicTopScope';
import { selector, Selector } from './selector';

export class SelectorTopScopeLocal extends Selector {
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
  protected async visitFBPath(
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

    if (startWithCapitalLetter(functionName) || functionName.slice(0, 3) === 'use') {
      this.program.localScopes[functionName] = new LogicTopScope(
        functionName,
        node as BaseNodeDescendant,
        this.program
      );
    }
  }
}
