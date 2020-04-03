import { JSXIdentifier, JSXMemberExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ExtendedNode } from '../parser/astNodes/extendedNode';
import { TopScopeMap } from '../parser/compDeps/logicAbstractDepNode';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';
import { ImportScopeProvider } from './importScopeProvider';
import { LocalScopeProvider } from './localScopeProvider';

export class ReactDomPlugin extends DepPlugin {
  public scopeDepMap: TopScopeMap = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  /**
   * handle pattern:
   * <Foo />
   */
  @selector('jsx_ele > jsx_o_ele > jsx_idt')
  protected async jsxTokenHandler(path: ExtendedNode[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    const depScope =
      this.program.getPluginInstance(LocalScopeProvider).localScopes[scopeName] ||
      this.program.getPluginInstance(ImportScopeProvider).imports[scopeName];
    if (depScope) {
      this.scopeDepMap[scopeName] = depScope;
    }
  }

  /**
   * handle pattern:
   * <Foo.bar />
   */
  @selector('jsx_ele > jsx_o_ele > jsx_mem_exp > jsx_idt')
  protected async jsxTokenInPropertyHandler(
    path: ExtendedNode[],
    node: JSXIdentifier,
    parent: JSXMemberExpression
  ): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const scopeName: string = node.name as string;
    const depScope =
      this.program.getPluginInstance(LocalScopeProvider).localScopes[scopeName] ||
      this.program.getPluginInstance(ImportScopeProvider).imports[scopeName];
    if (depScope) {
      this.scopeDepMap[scopeName] = depScope;
    }
  }
}
