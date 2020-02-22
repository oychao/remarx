import { Node, Range, SourceLocation } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { DepPlugin } from '../plugin/depPlugin';
import { LogicAbstractNode } from './logicAbstractNode';

export type BaseNodeDescendant = any;

export class ImplementedNode<T extends LogicAbstractNode = LogicAbstractNode> {
  public loc: SourceLocation;
  public range: Range;
  public type: any;

  public logicNode: T | undefined;

  constructor(astNode: Node) {
    this.loc = astNode.loc;
    this.range = astNode.range;

    for (const key in astNode) {
      if (astNode.hasOwnProperty(key)) {
        (this as any)[key] = (astNode as any)[key];
      }
    }
  }

  public async accept(plugin: DepPlugin, path: ImplementedNode[] = []): Promise<void> {
    await plugin.visit(this, path);
  }
}
