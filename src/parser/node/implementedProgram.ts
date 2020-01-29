import { Comment, Program, Statement, Token } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from './implementedNode';
import { LogicAbstractNode } from './logicAbstractNode';
import { LogicProgramCommon } from './logicProgramCommon';

export class ImplementedProgram<T extends LogicAbstractNode = LogicProgramCommon> extends ImplementedNode<T>
  implements Program {
  public body: Statement[];
  public sourceType: 'module' | 'script' = 'module';

  public comments: Comment[] | undefined;
  public tokens: Token[] | undefined;

  constructor(astNode: Program) {
    super(astNode);

    this.body = astNode.body;
  }
}
