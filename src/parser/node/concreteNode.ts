import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';

import { ProgramSourceType, VariableDeclarationType } from './interfaces';
import { Visitor } from '../visitor/visitor';

export class ConcreteNode {
  public type: AST_NODE_TYPES;
  public body?: ConcreteNode[];
  public declaration?: ConcreteNode;
  public declarations?: ConcreteNode[];
  public id?: ConcreteNode;
  public name?: string | ConcreteNode;
  public init?: ConcreteNode;
  public kind?: VariableDeclarationType;
  public generator?: boolean;
  public params?: ConcreteNode[];
  public callee?: ConcreteNode;
  public object?: ConcreteNode;
  public property?: ConcreteNode;
  public computed?: boolean;
  public optional?: boolean;
  public arguments?: ConcreteNode;
  public async?: boolean;
  public expression?: boolean;
  public typeAnnotation?: ConcreteNode;
  public range?: [number, number];
  public sourceType?: ProgramSourceType;
  public source?: ConcreteNode;
  public specifiers?: ConcreteNode[];
  public local?: ConcreteNode;
  public value?: string;

  constructor(node: any) {
    this.type = AST_NODE_TYPES.Program;
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        if (node[key] && typeof node[key] === 'object') {
          if (node[key].type) {
            node[key] = new ConcreteNode(node[key]);
          } else if (Array.isArray(node[key])) {
            node[key] = node[key].map((subNode: any) => (subNode.type ? new ConcreteNode(subNode) : subNode));
          }
        }
        (this as any)[key] = node[key];
      }
    }
  }

  public async accept(visitor: Visitor, path: ConcreteNode[] = []): Promise<void> {
    await visitor.visit(this, path);
  }
}
