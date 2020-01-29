import { LogicProgram } from './logicProgram';
import { ConcreteScope } from './concreteScope';

export type ScopeNodeDepend = TopScope | string | undefined;

export interface ScopeNodeMap {
  [key: string]: ScopeNodeDepend;
}

export class TopScope {
  public name: string;

  public concreteScope: ConcreteScope;

  public program: LogicProgram;

  public scopeDepMap: ScopeNodeMap = {};

  constructor(name: string, concreteScope: ConcreteScope, program: LogicProgram) {
    this.name = name;
    this.concreteScope = concreteScope;
    this.program = program;
  }

  public get depSign(): string {
    return `${this.program.fullPath}#${this.name}`;
  }
}
