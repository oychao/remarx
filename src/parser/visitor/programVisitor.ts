import { ConcreteNode } from '../node/astNode';
import { NodeProgramVisitable } from '../node/astTypes';
import { AbsVisitor } from './absVisitor';

export class ProgramVisitor extends AbsVisitor implements NodeProgramVisitable {
  public async visitProgram(element: ConcreteNode, path: ConcreteNode[]): Promise<void> {
    return new Promise(res => {
      setTimeout(res, 4e3, 1);
    });
  }
}
