import { ClassDeclaration } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from '../parser/implementedNode';
import { LogicProgramCommon } from '../parser/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';

export class ClassCompProvider extends DepPlugin {
  public classComponents: any = [];

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  @selector('cls_dton')
  protected classComp(path: ImplementedNode[], node: ClassDeclaration) {}
}
