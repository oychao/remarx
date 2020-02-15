import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';

import { BaseNodeDescendant, ImplementedNode } from '../node/implementedNode';
import { LogicProgramCommon } from '../node/logicProgramCommon';

export type NodeHandler = (
  path: ImplementedNode[],
  node: BaseNodeDescendant,
  parent: BaseNodeDescendant,
  grantParent: BaseNodeDescendant
) => Promise<void>;

export type SelectorHandlerMap = {
  selector: AST_NODE_TYPES[];
  handler: NodeHandler;
};

export enum SelectorToken {
  KwChild = '__KwChild',
  KwDescent = '__KwDescent',
  KwLoop = '__KwLoop',
  KwScopeLeft = '__KwScopeLeft',
  KwScopeRight = '__KwScopeRight',
}

/**
 * abstract selector, supply a common visit method, every concrete ast node which accept selector instance
 * would be visited by specific method of corresponding decent concrete selector.
 */
export abstract class Selector {
  public static parseSelectorString(selector: string): Array<AST_NODE_TYPES | SelectorToken> {
    return [...selector.trim().matchAll(/(>|L:|\(|\)|[a-zA-Z]+|\s+)/g)]
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
        return prevToken.slice(0, 2) !== '__' && nextToken.slice(0, 2) !== '__';
      });
  }

  public static readonly selectorKwKws: { [key: string]: SelectorToken } = {
    '>': SelectorToken.KwChild,
    'L:': SelectorToken.KwLoop,
    '(': SelectorToken.KwScopeLeft,
    ')': SelectorToken.KwScopeRight,
    ' ': SelectorToken.KwDescent,
  };

  private static readonly abbrs: { [key: string]: AST_NODE_TYPES } = {
    p: AST_NODE_TYPES.Program,
  };

  protected abstract selectorHandlerMap: SelectorHandlerMap[] = [];

  protected program: LogicProgramCommon;

  constructor(program: LogicProgramCommon) {
    this.program = program;
  }

  private matchSelectors(path: ImplementedNode[]): NodeHandler | undefined {
    for (let i = 0; i < this.selectorHandlerMap.length; i++) {
      const { selector, handler } = this.selectorHandlerMap[i];
      let j = selector.length - 1;
      let k = path.length - 1;
      let currSelector = selector[j];
      let currPathNode = path[k];
      let jumpToEnd = false;
      while (currSelector && currPathNode) {
        if (currSelector !== currPathNode.type) {
          jumpToEnd = true;
          break;
        }
        currSelector = selector[--j];
        currPathNode = path[--k];
      }
      if (jumpToEnd) {
        continue;
      }
      if (j === -1) {
        return handler;
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

// console.log(Selector.parseSelectorString('p p > p L:(p > p)'));
