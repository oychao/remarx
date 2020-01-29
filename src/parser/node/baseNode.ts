import { BaseNode, SourceLocation, Range } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

export class ConcreteBaseNode implements BaseNode {
  public loc: SourceLocation;
  public range: Range;

  constructor(astNode: BaseNode) {
    this.loc = astNode.loc;
    this.range = astNode.range;
  }
}
 