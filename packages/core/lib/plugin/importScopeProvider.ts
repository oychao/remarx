import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { ImportDeclaration } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ExtendedNode } from '../parser/astNodes/extendedNode';
import { TopScopeMap } from '../parser/compDeps/logicAbstractDepNode';
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
          const exportOfDep = dep?.getPluginInstance(ExportScopeProvider).exports[specifierName];
          if ((node.source.value as string).charAt(0) === '.') {
            if (exportOfDep) {
              this.imports[specifierName] = exportOfDep;
            }
          } else {
            this.imports[specifierName] = node.source.value as string;
          }
        } else if (AST_NODE_TYPES.ImportDefaultSpecifier === specifier.type) {
          const exportOfDep = dep?.getPluginInstance(ExportScopeProvider).defaultExport;
          if (exportOfDep) {
            this.imports[specifierName] = exportOfDep;
          }
        } else if (AST_NODE_TYPES.ImportNamespaceSpecifier === specifier.type) {
          if ((node.source.value as string).charAt(0) === '.') {
            this.imports[specifierName] = dep?.getPluginInstance(ExportScopeProvider).exports;
          } else {
            this.imports[specifierName] = node.source.value as string;
          }
        }
      });
    }
  }
}
