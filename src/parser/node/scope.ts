import { BlockStatement, Statement } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { ConcreteNode } from './concreteNode';

export class ConcreteScope extends ConcreteNode {
  public type: AST_NODE_TYPES.BlockStatement;

  public body: Statement[];

  constructor(astNode: BlockStatement) {
    super(astNode);
    this.type = AST_NODE_TYPES.BlockStatement;
    this.body = astNode.body;
  }
}