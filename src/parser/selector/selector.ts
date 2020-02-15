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

export enum SelectorRuleTokens {
  RuleChild = 'RuleChild',
  RuleDescent = 'RuleDescent',
  RuleLoop = 'RuleLoop',
  RuleScopeLeft = 'RuleScopeLeft',
  RuleScopeRight = 'RuleScopeRight',
}

/**
 * abstract selector, supply a common visit method, every concrete ast node which accept selector instance
 * would be visited by specific method of corresponding decent concrete selector.
 */
export abstract class Selector {
  public static parseSelectorString(selector: string): Array<AST_NODE_TYPES | SelectorRuleTokens> {
    const strTokens = selector.split(/\s{1,}/);
    const ret: Array<AST_NODE_TYPES | SelectorRuleTokens> = [];
    for (let i = 0; i < strTokens.length; i++) {
      const currStrToken = strTokens[i];
      const currToken = Selector.abbrs[currStrToken] || Selector.selectorKwRules[currStrToken];
      ret.push(currToken);

      const nextStrToken = strTokens[i + 1];
      if (!nextStrToken) {
        continue;
      }

      if (Selector.abbrs[currStrToken] && Selector.abbrs[nextStrToken]) {
        ret.push(SelectorRuleTokens.RuleDescent);
      }
    }
    return ret;
  }

  private static readonly selectorKwRules: { [key: string]: SelectorRuleTokens } = {
    '>': SelectorRuleTokens.RuleChild,
    ' ': SelectorRuleTokens.RuleDescent,
    'L:': SelectorRuleTokens.RuleLoop,
    '(': SelectorRuleTokens.RuleScopeLeft,
    ')': SelectorRuleTokens.RuleScopeRight,
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
