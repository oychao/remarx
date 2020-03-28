import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { ImportDeclaration } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ExtendedNode } from '../parser/astNodes/extendedNode';
import { TopScopeMap, LogicAbstractDepNode } from '../parser/compDeps/logicAbstractDepNode';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';
import { ExportScopeProvider } from './exportScopeProvider';

export class ImportScopeProvider extends DepPlugin {
  // import scopes
  public imports: TopScopeMap = {};

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  /**
   * handle pattern:
   * import Foo from './foo';
   * import { Foo } from './foo';
   * import * as Foo from './foo';
   */
  @selector('p > imp_dton')
  protected async visitPath1(path: ExtendedNode[], node: ImportDeclaration): Promise<void> {
    if (node?.source?.value) {
      const dep = await this.asyncImportLiteralSource(node.source.value as string);
      node.specifiers?.forEach((specifier: any) => {
        const specifierName: string = specifier.local?.name;
        if (!specifierName) {
          return;
        }

        if (AST_NODE_TYPES.ImportSpecifier === specifier.type) {
          const pluginInst = dep?.getPluginInstance(ExportScopeProvider);
          const exportOfDep = pluginInst?.exports[specifierName];
          if (this.rectifyAbsolutePath(node.source.value as string)) {
            if (exportOfDep) {
              if (
                exportOfDep instanceof LogicAbstractDepNode &&
                DepPlugin.EFFECTIVE_DEP_TYPES.includes(exportOfDep.type)
              ) {
                this.imports[specifierName] = exportOfDep;
                this.program.fileDepMapEffective[dep.fullPath] = dep;
              }
            }
          } else {
            this.imports[specifierName] = node.source.value as string;
          }
        } else if (AST_NODE_TYPES.ImportDefaultSpecifier === specifier.type) {
          const exportOfDep = dep?.getPluginInstance(ExportScopeProvider).defaultExport;
          if (exportOfDep) {
            if (
              exportOfDep instanceof LogicAbstractDepNode &&
              DepPlugin.EFFECTIVE_DEP_TYPES.includes(exportOfDep.type)
            ) {
              this.imports[specifierName] = exportOfDep;
              this.program.fileDepMapEffective[dep.fullPath] = dep;
            }
            this.imports[specifierName] = exportOfDep;
          }
        } else if (AST_NODE_TYPES.ImportNamespaceSpecifier === specifier.type) {
          if (this.rectifyAbsolutePath(node.source.value as string)) {
            const exportOfDep = dep?.getPluginInstance(ExportScopeProvider).exports;
            if (
              exportOfDep instanceof LogicAbstractDepNode &&
              DepPlugin.EFFECTIVE_DEP_TYPES.includes(exportOfDep.type)
            ) {
              this.imports[specifierName] = exportOfDep;
              this.program.fileDepMapEffective[dep.fullPath] = dep;
            }
            this.imports[specifierName] = exportOfDep;
          } else {
            this.imports[specifierName] = node.source.value as string;
          }
        }
      });
    }
  }
}
