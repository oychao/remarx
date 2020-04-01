import { Comment, Program, Statement, Token } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { LogicAbstractNode } from '../logicAbstractNode';
import { LogicProgramCommon } from '../programs/logicProgramCommon';
import { ExtendedNode } from './extendedNode';

export class ExtendedProgram<T extends LogicAbstractNode = LogicProgramCommon> extends ExtendedNode<T>
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
