import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { BaseNode } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { LogicProgram } from '../node/logicProgram';
import { ConcreteNode } from '../node/concreteNode';

export type BaseNodeDescendant<T = any> = BaseNode | T;

export type NodeHandler = (
  path: ConcreteNode[],
  node: BaseNodeDescendant,
  parent: BaseNodeDescendant,
  grantParent: BaseNodeDescendant
) => Promise<void>;

export type SelectorHandlerMap = {
  selector: AST_NODE_TYPES[];
  handler: NodeHandler;
};

/**
 * abstract visitor, supply a common visit method, every concrete ast node which accept visitor instance
 * would be visited by specific method of corresponding decent concrete visitor.
 */
export abstract class Visitor {
  protected program: LogicProgram;

  protected abstract selectorHandlerMap: SelectorHandlerMap[] = [];

  constructor(program: LogicProgram) {
    this.program = program;
  }

  private matchSelectors(path: ConcreteNode[]): NodeHandler | undefined {
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

  public async visit(node: ConcreteNode, path: ConcreteNode[] = []): Promise<void> {
    path.push(node);
    const handler = this.matchSelectors(path);

    if (handler) {
      await handler.call(this, path, node, path[path.length - 2], path[path.length - 3]);
    }

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = (node as any)[key];
        if (value instanceof ConcreteNode) {
          await value.accept(this, [...path]);
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const subValue = value[i];
            if (subValue instanceof ConcreteNode) {
              await subValue.accept(this, [...path]);
            }
          }
        }
      }
    }
    path.pop();
  }
}
