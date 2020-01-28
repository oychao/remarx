import { BaseNode, SourceLocation, Range } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

export class ConcreteBaseNode implements BaseNode {
  public loc: SourceLocation = {
    start: {
      line: -1,
      column: -1,
    },
    end: {
      line: -1,
      column: -1,
    },
  };
  public range: Range = [-1, -1];

  constructor(astNode: BaseNode) {
    this.loc = astNode.loc;
    this.range = astNode.range;
  }
}
