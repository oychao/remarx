import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { Program, Node } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from './implementedNode';
import { ImplementedProgram } from './implementedProgram';
import { ImplementedScope } from './implementedScope';

function getPossibleImplementedNodeConstructor(type: AST_NODE_TYPES): typeof ImplementedNode {
  switch (type) {
    case AST_NODE_TYPES.Program:
      return ImplementedProgram;
    case AST_NODE_TYPES.BlockStatement:
      return ImplementedScope;
    default:
      return ImplementedNode;
  }
}

export function parseAstToImplementedNode<T extends ImplementedProgram>(astNode: Node & any): T {
  const ClassConstructor = getPossibleImplementedNodeConstructor(astNode.type);
  const node = new ClassConstructor(astNode) as any;

  for (const key in astNode) {
    if (astNode.hasOwnProperty(key)) {
      if (astNode[key] && typeof astNode[key] === 'object') {
        if (astNode[key].type) {
          node[key] = parseAstToImplementedNode(astNode[key]);
        } else if (Array.isArray(astNode[key])) {
          node[key] = astNode[key].map((subNode: Node) => {
            if (subNode.type) {
              return parseAstToImplementedNode(subNode);
            } else {
              return subNode;
            }
          });
        }
      } else {
        node[key] = astNode[key];
      }
    }
  }

  return node;
}
