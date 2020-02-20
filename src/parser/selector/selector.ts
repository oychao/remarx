import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';

import { BaseNodeDescendant, ImplementedNode } from '../node/implementedNode';
import { LogicProgramCommon } from '../node/logicProgramCommon';

export type NodeHandler = (
  path: ImplementedNode[],
  node: BaseNodeDescendant,
  parent: BaseNodeDescendant,
  grantParent: BaseNodeDescendant
) => Promise<void>;

export type SelectorExpression = Array<AST_NODE_TYPES | SelectorToken> | string;

export type SelectorHandlerMap = {
  selector: SelectorExpression;
  handlerName: string;
};

// must start with two underscores
export enum SelectorToken {
  KwChild = '__KwChild',
  KwDescent = '__KwDescent',
  KwLoopStart = '__KwLoopStart',
  KwLoopEnd = '__KwLoopEnd',
}

/**
 * abstract selector, supply a common visit method, every concrete ast node which accept selector instance
 * would be visited by specific method of corresponding decent concrete selector.
 */
export abstract class Selector {
  public static parseSelectorString(selector: string): Array<AST_NODE_TYPES | SelectorToken> {
    return [...selector.trim().matchAll(/(>|L:\(|\)|[a-zA-Z_]+|\s+)/g)]
      .map(m => {
        const strToken = m[0].replace(/\s{1,}/, ' ');
        return Selector.abbrs[strToken] || Selector.selectorKwKws[strToken];
      })
      .filter((token: AST_NODE_TYPES | SelectorToken, idx, arr) => {
        if (!token) {
          return false;
        }
        if (SelectorToken.KwDescent !== token) {
          return true;
        }
        const prevToken = arr[idx - 1] || '';
        const nextToken = arr[idx + 1] || '';
        return !Selector.isSelectorToken(prevToken) && !Selector.isSelectorToken(nextToken);
      });
  }

  private static isSelectorToken(token: string) {
    return token.slice(0, 2) === '__';
  }

  public static readonly selectorKwKws: { [key: string]: SelectorToken } = {
    '>': SelectorToken.KwChild,
    'L:(': SelectorToken.KwLoopStart,
    ')': SelectorToken.KwLoopEnd,
    ' ': SelectorToken.KwDescent,
  };

  private static readonly abbrs: { [key: string]: AST_NODE_TYPES } = {
    p: AST_NODE_TYPES.Program,
    imp_dton: AST_NODE_TYPES.ImportDeclaration,
    exp_n_dton: AST_NODE_TYPES.ExportNamedDeclaration,
    exp_a_dton: AST_NODE_TYPES.ExportAllDeclaration,
    exp_d_dton: AST_NODE_TYPES.ExportDefaultDeclaration,
    lit: AST_NODE_TYPES.Literal,
    idt: AST_NODE_TYPES.Identifier,
    v_dton: AST_NODE_TYPES.VariableDeclaration,
    v_dtor: AST_NODE_TYPES.VariableDeclarator,
    f_dton: AST_NODE_TYPES.FunctionDeclaration,
    f_exp: AST_NODE_TYPES.FunctionExpression,
    af_exp: AST_NODE_TYPES.ArrowFunctionExpression,
    cl: AST_NODE_TYPES.CallExpression,
    jsx_ele: AST_NODE_TYPES.JSXElement,
    jsx_o_ele: AST_NODE_TYPES.JSXOpeningElement,
    jsx_mem_exp: AST_NODE_TYPES.JSXMemberExpression,
    jsx_idt: AST_NODE_TYPES.JSXIdentifier,
    blk: AST_NODE_TYPES.BlockStatement,
  };

  protected program: LogicProgramCommon;

  constructor(program: LogicProgramCommon) {
    this.program = program;
  }

  private matchSelectors(path: ImplementedNode[]): NodeHandler | undefined {
    const selectorHandlerMap = (this as any).getSelectorHandlerMap ? (this as any).getSelectorHandlerMap() : [];

    for (let i = 0; i < selectorHandlerMap.length; i++) {
      const { selector, handlerName } = selectorHandlerMap[i];
      const handler = (this as any)[handlerName];
      const selectorTokens = typeof selector === 'string' ? Selector.parseSelectorString(selector) : [...selector];
      let j = selectorTokens.length - 1;
      let k = path.length - 1;
      let currNodeToken = selectorTokens[j];
      let upLevelSelectorToken = selectorTokens[--j];
      let currPathNode = path[k];
      let jumpToEnd = false;
      while (currNodeToken && currPathNode) {
        if (currNodeToken !== currPathNode.type) {
          jumpToEnd = true;
          break;
        }
        currNodeToken = selectorTokens[--j];
        upLevelSelectorToken = selectorTokens[--j];
        currPathNode = path[--k];

        // TODO implement selector token logic
        switch (upLevelSelectorToken) {
          case SelectorToken.KwChild:
            break;
          case SelectorToken.KwDescent:
            break;
          default:
            break;
        }
      }
      if (jumpToEnd) {
        continue;
      }
      if (j < 0) {
        return handler as NodeHandler;
      }
    }
    return undefined;
  }

  public async visit(node: ImplementedNode, path: ImplementedNode[] = []): Promise<void> {
    path.push(node);
    const handler = this.matchSelectors(path);

    if (handler) {
      await handler.call(this, path, node, path[path.length - 2], path[path.length - 3]);
    }

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = (node as any)[key];
        if (value instanceof ImplementedNode) {
          await value.accept(this, [...path]);
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const subValue = value[i];
            if (subValue instanceof ImplementedNode) {
              await subValue.accept(this, [...path]);
            }
          }
        }
      }
    }
    path.pop();
  }
}

const classSelectorMap: { [key: string]: SelectorHandlerMap[] } = {};
export const selector = function(selectorString: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!classSelectorMap[target.constructor.name]) {
      classSelectorMap[target.constructor.name] = [];
    }

    if (!target.getSelectorHandlerMap) {
      target.getSelectorHandlerMap = function() {
        return classSelectorMap[target.constructor.name];
      };
    }

    classSelectorMap[target.constructor.name].push({
      selector: selectorString,
      handlerName: propertyKey,
    });
  };
};

// console.log(Selector.parseSelectorString('p p > p L:(p > p)'));
