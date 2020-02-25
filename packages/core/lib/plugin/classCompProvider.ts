import { LogicProgramCommon } from '../parser/logicProgramCommon';
import { DepPlugin } from './depPlugin';

export class ClassCompProvider extends DepPlugin {
  constructor(program: LogicProgramCommon) {
    super(program);
  }
}
