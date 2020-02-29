import { ImplementedClass } from '../parser/implementedClass';
import { ImplementedNode } from '../parser/implementedNode';
import { LogicClass } from '../parser/logicClass';
import { LogicProgramCommon } from '../parser/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';

export class ClassCompProvider extends DepPlugin {
  public classComponents: { [key: string]: LogicClass } = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  @selector('cls_dton')
  protected classComp(path: ImplementedNode[], node: ImplementedClass) {
    const logicClass = new LogicClass(node, this.program);
    this.classComponents[logicClass.name] = logicClass;
  }
}
