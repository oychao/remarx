import { Program } from '../program';
import { ConcreteNode } from './concreteNode';

export type ScopeNodeDepend = TopScope | string | undefined;

export interface ScopeNodeMap {
  [key: string]: ScopeNodeDepend;
}

export class TopScope {
  public name: string;

  public node: ConcreteNode;

  public program: Program;

  public hookDepMap: ScopeNodeMap = {};

  public compDepMap: ScopeNodeMap = {};

  constructor(name: string, node: ConcreteNode, program: Program) {
    this.name = name;
    this.node = node;
    this.program = program;
  }

  public get depSign(): string {
    return `${this.program.fullPath}#${this.name}`;
  }
}
