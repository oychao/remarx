import { JSXIdentifier, JSXMemberExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { LogicProgramCommon } from '../node/logicProgramCommon';
import { TopScopeMap } from '../node/logicTopScope';
import { DepPlugin, selector } from './depPlugin';

export class ReactDomPlugin extends DepPlugin {
  public scopeDepMap: TopScopeMap = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  @selector('jsx_ele > jsx_o_ele > jsx_idt')
  protected async visitPath1(path: any[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    const depScope =
      this.program.localScopeProvider.localScopes[scopeName] || this.program.importScopeProvider.imports[scopeName];
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
    const depScope =
      this.program.localScopeProvider.localScopes[scopeName] || this.program.importScopeProvider.imports[scopeName];
    if (depScope) {
      this.scopeDepMap[scopeName] = depScope;
    }
  }
}
