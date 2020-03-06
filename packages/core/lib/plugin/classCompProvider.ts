import { ImplementedClass } from '../parser/implementedClass';
import { ImplementedNode } from '../parser/implementedNode';
import { LogicClassComponent } from '../parser/logicAClassComponent';
import { LogicProgramCommon } from '../parser/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';

export class ClassCompProvider extends DepPlugin {
  public classComponents: { [key: string]: LogicClassComponent } = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  @selector('cls_dton')
  protected classComp(path: ImplementedNode[], node: ImplementedClass) {
    const logicClassComponent = new LogicClassComponent(node, this.program);
    this.classComponents[LogicClassComponent.name] = logicClassComponent;
  }
}
