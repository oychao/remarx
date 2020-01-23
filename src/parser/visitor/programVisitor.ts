import { ConcreteNode } from '../node/astNode';
import { NodeProgramVisitable } from '../node/astTypes';
import { AbsVisitor } from './absVisitor';

export class ProgramVisitor extends AbsVisitor implements NodeProgramVisitable {
  public visitProgram(element: ConcreteNode, path: ConcreteNode[]): void {
    throw new Error('Method not implemented.');
  }
}
