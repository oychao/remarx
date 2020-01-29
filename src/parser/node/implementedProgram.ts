import { Program, Statement, Comment, Token } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from './implementedNode';

export class ImplementedProgram extends ImplementedNode implements Program {
  public body: Statement[];
  public sourceType: 'module' | 'script' = 'module';

  public comments: Comment[] | undefined;
  public tokens: Token[] | undefined;

  constructor(astNode: Program) {
    super(astNode);

    this.body = astNode.body;
  }
}
