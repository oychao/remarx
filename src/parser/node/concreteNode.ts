import { BaseNode, SourceLocation, Range } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { Visitor } from '../visitor/visitor';

export class ConcreteNode implements BaseNode {
  public loc: SourceLocation;
  public range: Range;
  public type: unknown;

  constructor(astNode: BaseNode & any) {
    this.loc = astNode.loc;
    this.range = astNode.range;

    for (const key in astNode) {
      if (astNode.hasOwnProperty(key)) {
        if (astNode[key] && typeof astNode[key] === 'object') {
          if (astNode[key].type) {
            astNode[key] = new ConcreteNode(astNode[key]);
          } else if (Array.isArray(astNode[key])) {
            astNode[key] = astNode[key].map((subNode: any) => (subNode.type ? new ConcreteNode(subNode) : subNode));
          }
        }
        (this as any)[key] = astNode[key];
      }
    }
  }

  public async accept(visitor: Visitor, path: ConcreteNode[] = []): Promise<void> {
    await visitor.visit(this, path);
  }
}
