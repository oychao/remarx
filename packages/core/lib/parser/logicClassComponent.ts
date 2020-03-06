import { ImplementedClass } from './implementedClass';
import { LogicAbstractDepNode } from './logicAbstractDepNode';
import { LogicProgramCommon } from './logicProgramCommon';

export class LogicClassComponent extends LogicAbstractDepNode {
  public name: string;

  public program: LogicProgramCommon;

  constructor(astNode: ImplementedClass, program: LogicProgramCommon) {
    super(astNode.id.name, astNode, program);
    this.name = astNode.id.name;
    this.program = program;
  }

  public get depSign(): string {
    return `${this.program.fullPath}#${this.name}`;
  }
}
