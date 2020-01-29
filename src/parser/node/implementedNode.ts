import { Node, SourceLocation, Range } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { Visitor } from '../visitor/visitor';
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';

export type BaseNodeDescendant<T = any> = Node | T;

export class ImplementedNode {
  public loc: SourceLocation;
  public range: Range;
  public type: any;

  constructor(astNode: Node) {
    this.loc = astNode.loc;
    this.range = astNode.range;

    for (const key in astNode) {
      if (astNode.hasOwnProperty(key)) {
        (this as any)[key] = (astNode as any)[key];
      }
    }
  }

  public async accept(visitor: Visitor, path: ImplementedNode[] = []): Promise<void> {
    await visitor.visit(this, path);
  }
}
