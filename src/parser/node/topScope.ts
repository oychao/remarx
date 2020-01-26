import { Program } from '../program';
import { ConcreteNode } from './concreteNode';

export interface ScopeNodeMap {
  [key: string]: TopScope;
}

export class TopScope {
  public name: string;

  public node: ConcreteNode;

  public program: Program;

  constructor(name: string, node: ConcreteNode, program: Program) {
    this.name = name;
    this.node = node;
    this.program = program;
  }
}
