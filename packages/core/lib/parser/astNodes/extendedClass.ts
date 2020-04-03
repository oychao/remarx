import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ClassBody,
  ClassDeclaration,
  Identifier,
  Statement,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { LogicClassComponent } from '../compDeps/logicClassComponent';
import { LogicNode } from '../logicNode';
import { ExtendedNode } from './extendedNode';

export class ExtendedClass<T extends LogicNode = LogicClassComponent> extends ExtendedNode<T>
  implements ExtendedNode<T> {
  public id: Identifier;

  public type: AST_NODE_TYPES.ClassDeclaration;

  public body: ClassBody;

  public superClass: Statement | undefined;

  constructor(astNode: ClassDeclaration) {
    super(astNode);
    this.id = astNode.id;
    this.type = AST_NODE_TYPES.ClassDeclaration;
    this.body = astNode.body;
  }
}
