import { Program } from '../program';
import { ConcreteNode } from './concreteNode';

export interface ScopeNodeMap {
  [key: string]: TopScope | string | undefined;
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
}
