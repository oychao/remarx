import { ImplementedScope } from './implementedScope';
import { LogicProgramCommon } from './logicProgramCommon';
import { LogicScope } from './logicScope';

export type ScopeNodeDepend = LogicTopScope | string | undefined;

export interface ScopeNodeMap {
  [key: string]: ScopeNodeDepend;
}

export class LogicTopScope extends LogicScope {
  public name: string;

  public program: LogicProgramCommon;

  public scopeDepMap: ScopeNodeMap = {};

  constructor(name: string, astNode: ImplementedScope, program: LogicProgramCommon) {
    super(astNode);
    this.name = name;
    this.program = program;
  }

  public get depSign(): string {
    return `${this.program.fullPath}#${this.name}`;
  }
}
