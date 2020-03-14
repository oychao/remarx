import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { Node } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ExtendedClass } from './extendedClass';
import { ExtendedNode } from './extendedNode';
import { ExtendedProgram } from './extendedProgram';
import { ExtendedScope } from './extendedScope';

function getPossibleExtendedNodeConstructor(type: AST_NODE_TYPES): typeof ExtendedNode {
  switch (type) {
    case AST_NODE_TYPES.Program:
      return ExtendedProgram;
    case AST_NODE_TYPES.BlockStatement:
      return ExtendedScope as typeof ExtendedNode;
    case AST_NODE_TYPES.ClassDeclaration:
      return ExtendedClass as typeof ExtendedNode;
    default:
      return ExtendedNode;
  }
}

export function parseAstToExtendedNode<R extends ExtendedProgram>(astNode: Node & any): R {
  const ClassConstructor = getPossibleExtendedNodeConstructor(astNode.type);
  const node = Reflect.construct(ClassConstructor, [astNode]);

  for (const key in astNode) {
    if (astNode.hasOwnProperty(key)) {
      if (astNode[key] && 'object' === typeof astNode[key]) {
        if (astNode[key].type) {
          node[key] = parseAstToExtendedNode(astNode[key]);
        } else if (Array.isArray(astNode[key])) {
          node[key] = astNode[key].map((subNode: Node) => {
            if (subNode?.type) {
              return parseAstToExtendedNode(subNode);
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
