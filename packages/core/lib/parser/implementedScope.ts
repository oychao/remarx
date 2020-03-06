import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { BlockStatement, Statement } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from './implementedNode';
import { LogicNode } from './logicNode';

export class ImplementedScope<T extends LogicNode = LogicNode> extends ImplementedNode<T> implements BlockStatement {
  public type: AST_NODE_TYPES.BlockStatement;

  public body: Statement[];

  constructor(astNode: BlockStatement) {
    super(astNode);
    this.type = AST_NODE_TYPES.BlockStatement;
    this.body = astNode.body;
  }
}
