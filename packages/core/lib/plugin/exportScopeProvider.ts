import {
  ExportNamedDeclaration,
  Identifier,
  Literal,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ImplementedNode } from '../parser/implementedNode';
import { TopScopeMap, LogicAbstractDepNode } from '../parser/logicAbstractDepNode';
import { LogicClassComponent } from '../parser/logicClassComponent';
import { LogicProgramCommon } from '../parser/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';
import { LocalScopeProvider } from './localScopeProvider';
import { ClassCompProvider } from './classCompProvider';

export class ExportScopeProvider extends DepPlugin {
  // export scopes
  public exports: TopScopeMap = {};

  // default export scope
  public defaultExport: LogicAbstractDepNode | undefined;

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
              ? dep.getPluginInstance(ExportScopeProvider).defaultExport
              : dep.getPluginInstance(ExportScopeProvider).exports[specifier.local.name];
          if (targetScope && targetScope instanceof LogicAbstractDepNode) {
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
        for (const key in dep.getPluginInstance(ExportScopeProvider).exports) {
          if (dep.getPluginInstance(ExportScopeProvider).exports.hasOwnProperty(key)) {
            const scope = dep.getPluginInstance(ExportScopeProvider).exports[key];
            if (scope instanceof LogicAbstractDepNode) {
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
   * export class foo
   */
  @selector('exp_n_dton > cls_dton > idt')
  @selector('exp_n_dton > f_dton > idt')
  @selector('exp_n_dton > v_dton > v_dtor > idt')
  protected async visitPath4(path: ImplementedNode[], node: Identifier): Promise<void> {
    const scopeName: string = node.name;
    const exportScope = this.program.getPluginInstance(LocalScopeProvider).localScopes[scopeName];
    if (exportScope instanceof LogicAbstractDepNode) {
      this.exports[scopeName] = exportScope;
    }
    const exportClass = this.program.getPluginInstance(ClassCompProvider).classComponents[scopeName];
    if (exportClass instanceof LogicClassComponent) {
      this.exports[scopeName] = exportClass;
    }
  }

  /**
   * handle pattern:
   * export default foo;
   * export default class foo ...
   */
  @selector('p > exp_d_dton > cls_dton > idt')
  @selector('p > exp_d_dton > idt')
  protected async visitPath5(path: ImplementedNode[], node: Identifier): Promise<void> {
    const scopeName: string = node.name as string;
    const exportScope = this.program.getPluginInstance(LocalScopeProvider).localScopes[scopeName];
    if (exportScope instanceof LogicAbstractDepNode) {
      this.defaultExport = exportScope;
    }
    const exportClass = this.program.getPluginInstance(ClassCompProvider).classComponents[scopeName];
    if (exportClass instanceof LogicClassComponent) {
      this.defaultExport = exportClass;
    }
  }
}
