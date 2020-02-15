import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { JSXIdentifier, JSXMemberExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { LogicProgramCommon } from '../node/logicProgramCommon';
import { TopScopeMap } from '../node/logicTopScope';
import { Selector, SelectorHandlerMap } from './selector';

export class SelectorReactDom extends Selector {
  protected selectorHandlerMap: SelectorHandlerMap[];

  public scopeDepMap: TopScopeMap = {};

  constructor(program: LogicProgramCommon) {
    super(program);
    this.selectorHandlerMap = [
      {
        // selector: [AST_NODE_TYPES.JSXElement, AST_NODE_TYPES.JSXOpeningElement, AST_NODE_TYPES.JSXIdentifier],
        selector: 'jsx_ele > jsx_o_ele > jsx_idt',
        handler: this.handleJJJPath,
      },
      {
        // selector: [
        //   AST_NODE_TYPES.JSXElement,
        //   AST_NODE_TYPES.JSXOpeningElement,
        //   AST_NODE_TYPES.JSXMemberExpression,
        //   AST_NODE_TYPES.JSXIdentifier,
        // ],
        selector: 'jsx_ele > jsx_o_ele > jsx_mem_exp > jsx_idt',
        handler: this.handleJJJJPath,
      },
    ];
  }

  private async handleJJJPath(path: any[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    const depScope = this.program.localScopes[scopeName] || this.program.imports[scopeName];
    if (depScope) {
      this.scopeDepMap[scopeName] = depScope;
    }
  }

  private async handleJJJJPath(path: any[], node: JSXIdentifier, parent: JSXMemberExpression): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const scopeName: string = node.name as string;
    const depScope = this.program.localScopes[scopeName] || this.program.imports[scopeName];
    if (depScope) {
      this.scopeDepMap[scopeName] = depScope;
    }
  }
}
