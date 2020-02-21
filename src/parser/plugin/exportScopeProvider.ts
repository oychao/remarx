import {
  ExportNamedDeclaration,
  Identifier,
  Literal,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from '../node/implementedNode';
import { LogicProgramCommon } from '../node/logicProgramCommon';
import { LogicTopScope, TopScopeMap } from '../node/logicTopScope';
import { DepPlugin, selector } from './depPlugin';

export class ExportScopeProvider extends DepPlugin {
  // export scopes
  public exports: TopScopeMap = {};

  // default export scope
  public defaultExport: LogicTopScope | undefined;

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  /**
   * handle pattern:
   * export { default } from './xxx';
   */
  @selector('exp_n_dton > lit')
  protected async scanDirectedNamedExport(
    path: ImplementedNode[],
    node: Literal,
    parent: ExportNamedDeclaration
  ): Promise<void> {
    if (node.value) {
      const dep = await this.asyncImportLiteralSource(node.value as string);
      if (dep) {
        parent.specifiers.forEach(specifier => {
          const targetScope =
            specifier.local.name === 'default'
              ? dep.exportScopeProvider.defaultExport
              : dep.exportScopeProvider.exports[specifier.local.name];
          if (targetScope && targetScope instanceof LogicTopScope) {
            if (specifier.exported.name === 'default') {
              this.defaultExport = targetScope;
            } else {
              this.exports[specifier.exported.name] = targetScope;
            }
          }
        });
      }
    }
  }

  /**
   * handle pattern:
   * export * from './xxx';
   */
  @selector('p > exp_a_dton > lit')
  protected async visitPath3(path: ImplementedNode[], node: Literal): Promise<void> {
    if (node.value) {
      const dep = await this.asyncImportLiteralSource(node.value as string);
      if (dep) {
        for (const key in dep.exportScopeProvider.exports) {
          if (dep.exportScopeProvider.exports.hasOwnProperty(key)) {
            const scope = dep.exportScopeProvider.exports[key];
            if (scope instanceof LogicTopScope) {
              this.exports[key] = scope;
            }
          }
        }
      }
    }
  }

  /**
   * handler pattern:
   * export const foo = ...;
   * export function foo () {}
   */
  @selector('exp_n_dton > f_dton > idt')
  @selector('exp_n_dton > v_dton > v_dtor > idt')
  protected async visitPath4(path: ImplementedNode[], node: Identifier): Promise<void> {
    const scopeName: string = node.name;
    const exportScope = this.program.localScopeProvider.localScopes[scopeName];
    if (exportScope instanceof LogicTopScope) {
      this.exports[scopeName] = exportScope;
    }
  }

  /**
   * handle pattern:
   * export default foo;
   */
  @selector('p > exp_d_dton > idt')
  protected async visitPath5(path: ImplementedNode[], node: Identifier): Promise<void> {
    const scopeName: string = node.name as string;
    const exportScope = this.program.localScopeProvider.localScopes[scopeName];
    if (exportScope instanceof LogicTopScope) {
      this.defaultExport = exportScope;
    }
  }
}
