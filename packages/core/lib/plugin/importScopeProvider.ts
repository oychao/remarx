import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ImportDeclaration,
  CallExpression,
  Identifier,
  Literal,
  VariableDeclarator,
  ExportAllDeclaration,
  ExportNamedDeclaration,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

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

  /**
   * handle pattern:
   * React.lazy(() => import('foo'))
   */
  @selector('cl > imp')
  protected async lazyComp(
    path: ExtendedNode[],
    node: ImportDeclaration,
    parent: CallExpression,
    grantParent: CallExpression
  ) {
    path.pop(); // node
    path.pop(); // parent
    path.pop(); // grantParent
    const grantGrantParent = (path.pop() as unknown) as CallExpression;
    if (
      grantGrantParent &&
      AST_NODE_TYPES.MemberExpression === grantGrantParent.callee.type &&
      'React' === (grantGrantParent.callee.object as Identifier).name &&
      'lazy' === (grantGrantParent.callee.property as Identifier).name
    ) {
      let specifierName: string = null;
      let curNode = path.pop();
      while (curNode) {
        if (AST_NODE_TYPES.VariableDeclarator === curNode.type) {
          specifierName = (((curNode as unknown) as VariableDeclarator).id as Identifier).name;
          break;
        }
        curNode = path.pop();
      }

      const dep = await this.asyncImportLiteralSource((parent?.arguments[0] as Literal)?.value as string);
      const exportOfDep: LogicAbstractDepNode = dep?.getPluginInstance(ExportScopeProvider).defaultExport;

      if (!specifierName || !exportOfDep || !(exportOfDep instanceof LogicAbstractDepNode)) {
        console.error('dependency of import error');
      } else {
        this.imports[specifierName] = exportOfDep;
        this.program.fileDepMapEffective[dep.fullPath] = dep;
      }
    }
  }

  /**
   * handle pattern:
   * export * from './foo';
   */
  @selector('exp_a_dton')
  protected async exportAll(path: ExtendedNode[], node: ExportAllDeclaration) {
    const dep = await this.asyncImportLiteralSource((node.source as Literal).value as string);
    if (dep) {
      this.program.fileDepMapEffective[dep.fullPath] = dep;
    }
  }

  /**
   * handle pattern:
   * export { Foo } from './foo';
   */
  @selector('exp_n_dton')
  protected async exportSpecifier(path: ExtendedNode[], node: ExportNamedDeclaration) {
    const importPathValue = (node?.source as Literal)?.value as string;
    if (!importPathValue) {
      return;
    }
    const dep = await this.asyncImportLiteralSource(importPathValue);
    if (dep) {
      this.program.fileDepMapEffective[dep.fullPath] = dep;
    }
  }
}
