import { ExtendedClass } from '../parser/astNodes/extendedClass';
import { ExtendedNode } from '../parser/astNodes/extendedNode';
import { LogicClassComponent } from '../parser/compDeps/logicClassComponent';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';

export class ClassCompProvider extends DepPlugin {
  public classComponents: { [key: string]: LogicClassComponent } = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  @selector('cls_dton')
  protected classCompHandler(path: ExtendedNode[], node: ExtendedClass) {
    const logicClassComponent = new LogicClassComponent(node, this.program);
    this.classComponents[logicClassComponent.name] = logicClassComponent;
  }
}
