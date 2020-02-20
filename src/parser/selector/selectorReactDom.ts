import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { JSXIdentifier, JSXMemberExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { LogicProgramCommon } from '../node/logicProgramCommon';
import { TopScopeMap } from '../node/logicTopScope';
import { selector, Selector } from './selector';

export class SelectorReactDom extends Selector {
  public scopeDepMap: TopScopeMap = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  @selector('jsx_ele > jsx_o_ele > jsx_idt')
  protected async visitPath1(path: any[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    const depScope = this.program.localScopes[scopeName] || this.program.imports[scopeName];
    if (depScope) {
      this.scopeDepMap[scopeName] = depScope;
    }
  }

  @selector('jsx_ele > jsx_o_ele > jsx_mem_exp > jsx_idt')
  protected async visitPath2(path: any[], node: JSXIdentifier, parent: JSXMemberExpression): Promise<void> {
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
