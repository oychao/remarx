import { ExtendedClass } from '../astNodes/extendedClass';
import { LogicProgramCommon } from '../programs/logicProgramCommon';
import { LogicAbstractDepNode } from './logicAbstractDepNode';

export class LogicClassComponent extends LogicAbstractDepNode {
  public name: string;

  public program: LogicProgramCommon;

  constructor(astNode: ExtendedClass, program: LogicProgramCommon) {
    super(astNode.id.name, astNode, program);
    this.name = astNode.id.name;
    this.program = program;
  }

  public get depSign(): string {
    return `${this.program.fullPath}#${this.name}`;
  }
}
