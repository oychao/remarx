import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ExportNamedDeclaration,
  Identifier,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  Literal,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import * as path from 'path';

import { fileExists } from '../../utils';
import { ImplementedNode } from '../node/implementedNode';
import { LogicProgramCommon } from '../node/logicProgramCommon';
import { LogicTopScope } from '../node/logicTopScope';
import { selector, Selector } from './selector';

export class SelectorFileDependency extends Selector {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  private dirPath: string;

  constructor(program: LogicProgramCommon, dirPath: string) {
    super(program);
    this.dirPath = dirPath;
  }

  private async asyncImportLiteralSource(sourceValue: string): Promise<LogicProgramCommon | undefined> {
    if (sourceValue && typeof sourceValue === 'string') {
      if (sourceValue.charAt(0) !== '.') {
        this.program.fileDepMap[sourceValue] = sourceValue;
        return undefined;
      }

      const originPath = path.resolve(this.dirPath, sourceValue);
      let possiblePath = originPath;
      let isFile = await fileExists(possiblePath);
      let i = 0;

      // determine readable target module full path;
      while (!isFile && i < SelectorFileDependency.POSSIBLE_FILE_SUFFIXES.length) {
        possiblePath = `${originPath}${SelectorFileDependency.POSSIBLE_FILE_SUFFIXES[i++]}`;
        isFile = await fileExists(possiblePath);
      }

      const suffix = possiblePath.split('.').pop();
      if (suffix !== 'ts' && suffix !== 'tsx') {
        return undefined;
      }

      const dep = LogicProgramCommon.produce(possiblePath);
      await dep.parse();
      this.program.fileDepMap[possiblePath] = dep;
      return dep;
    }
    return undefined;
  }

  /**
   * handle pattern:
   * import Foo from './foo';
   * import { Foo } from './foo';
   * import * as Foo from './foo';
   */
  @selector('p > imp_dton')
  protected async visitPath1(path: ImplementedNode[], node: ImportDeclaration): Promise<void> {
    if (node?.source?.value) {
      const dep = await this.asyncImportLiteralSource(node.source.value as string);
      node.specifiers?.forEach((specifier: any) => {
        const specifierName: string = specifier.local?.name;
        if (!specifierName) {
          return;
        }

        if (AST_NODE_TYPES.ImportSpecifier === specifier.type) {
          const exportOfDep = dep?.exports[specifierName];
          if (exportOfDep) {
            this.program.imports[specifierName] = exportOfDep;
          }
        } else if (AST_NODE_TYPES.ImportDefaultSpecifier === specifier.type) {
          const exportOfDep = dep?.defaultExport;
          if (exportOfDep) {
            this.program.imports[specifierName] = exportOfDep;
          }
        } else if (AST_NODE_TYPES.ImportNamespaceSpecifier === specifier.type) {
          if ((node.source.value as string).charAt(0) === '.') {
            this.program.imports[specifierName] = dep?.exports;
          } else {
            this.program.imports[specifierName] = node.source.value as string;
          }
        }
      });
    }
  }

  /**
   * handle pattern:
   * import * as Foo from 'foo';
   */
  public async visitPath2(path: ImplementedNode[], node: ImportNamespaceSpecifier): Promise<void> {
    // {
    //   "type": "ImportNamespaceSpecifier",
    //   "local": {
    //     "type": "Identifier",
    //     "name": "React"
    //   }
    // }
  }

  /**
   * handle pattern:
   * import Foo from 'foo';
   */
  public async visitPath3(path: ImplementedNode[], node: ImportDefaultSpecifier): Promise<void> {
    // {
    //   "type": "ImportDefaultSpecifier",
    //   "local": {
    //     "type": "Identifier",
    //     "name": "App"
    //   }
    // }
  }

  /**
   * handle pattern:
   * export { default } from './xxx';
   */
  @selector('exp_n_dton > lit')
  protected async visitPath4(path: ImplementedNode[], node: Literal, parent: ExportNamedDeclaration): Promise<void> {
    if (node.value) {
      const dep = await this.asyncImportLiteralSource(node.value as string);
      if (dep) {
        parent.specifiers.forEach(specifier => {
          const targetScope =
            specifier.local.name === 'default' ? dep.defaultExport : dep.exports[specifier.local.name];
          if (targetScope && targetScope instanceof LogicTopScope) {
            if (specifier.exported.name === 'default') {
              this.program.defaultExport = targetScope;
            } else {
              this.program.exports[specifier.exported.name] = targetScope;
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
  protected async visitPath5(path: ImplementedNode[], node: Literal): Promise<void> {
    if (node.value) {
      const dep = await this.asyncImportLiteralSource(node.value as string);
      if (dep) {
        for (const key in dep.exports) {
          if (dep.exports.hasOwnProperty(key)) {
            const scope = dep.exports[key];
            if (scope instanceof LogicTopScope) {
              this.program.exports[key] = scope;
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
  protected async visitPath6(path: ImplementedNode[], node: Identifier): Promise<void> {
    const scopeName: string = node.name;
    const exportScope = this.program.localScopes[scopeName];
    if (exportScope instanceof LogicTopScope) {
      this.program.exports[scopeName] = exportScope;
    }
  }

  /**
   * handle pattern:
   * export default foo;
   */
  @selector('p > exp_d_dton > idt')
  protected async visitPath7(path: ImplementedNode[], node: Identifier): Promise<void> {
    const scopeName: string = node.name as string;
    const exportScope = this.program.localScopes[scopeName];
    if (exportScope instanceof LogicTopScope) {
      this.program.defaultExport = exportScope;
    }
  }
}
