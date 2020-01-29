import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { ImportDeclaration, Literal, Identifier } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import * as path from 'path';

import { fileExists } from '../../utils';
import { ImplementedNode } from '../node/implementedNode';
import { LogicTopScope, ScopeNodeMap } from '../node/logicTopScope';
import { LogicProgramCommon } from '../node/logicProgramCommon';
import { Visitor, SelectorHandlerMap } from './visitor';

export class VisitorFileDependency extends Visitor {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  private dirPath: string;

  public imports: LogicProgramCommon[] = [];

  public exports: ScopeNodeMap = {};

  public defaultExport: LogicTopScope | undefined;

  public identifierDepMap: { [key: string]: LogicProgramCommon | undefined } = {};

  constructor(program: LogicProgramCommon, dirPath: string) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AST_NODE_TYPES.Program, AST_NODE_TYPES.ImportDeclaration],
        handler: this.visitIPath,
      },
      {
        selector: [AST_NODE_TYPES.ExportNamedDeclaration, AST_NODE_TYPES.Literal],
        handler: this.visitELPath,
      },
      {
        selector: [AST_NODE_TYPES.Program, AST_NODE_TYPES.ExportAllDeclaration, AST_NODE_TYPES.Literal],
        handler: this.visitPELPath,
      },
      {
        selector: [
          AST_NODE_TYPES.ExportNamedDeclaration,
          AST_NODE_TYPES.VariableDeclaration,
          AST_NODE_TYPES.VariableDeclarator,
          AST_NODE_TYPES.Identifier,
        ],
        handler: this.visitEVVPath,
      },
      {
        selector: [AST_NODE_TYPES.Program, AST_NODE_TYPES.ExportDefaultDeclaration, AST_NODE_TYPES.Identifier],
        handler: this.visitPEIPath,
      },
    ];
    this.dirPath = dirPath;
  }

  private async asyncImportLiteralSource(sourceValue: string): Promise<LogicProgramCommon | undefined> {
    if (sourceValue && typeof sourceValue === 'string') {
      if (sourceValue.charAt(0) !== '.') {
        return undefined;
      }

      const originPath = path.resolve(this.dirPath, sourceValue);
      let possiblePath = originPath;
      let isFile = await fileExists(possiblePath);
      let i = 0;
      // determine readable target module full path;
      while (!isFile && i < VisitorFileDependency.POSSIBLE_FILE_SUFFIXES.length) {
        possiblePath = `${originPath}${VisitorFileDependency.POSSIBLE_FILE_SUFFIXES[i++]}`;
        isFile = await fileExists(possiblePath);
      }

      const suffix = possiblePath.split('.').pop();
      if (suffix !== 'ts' && suffix !== 'tsx') {
        return undefined;
      }

      const dep = LogicProgramCommon.produce(possiblePath);
      await dep.parse();
      this.imports.push(dep);
      return dep;
    }
    return undefined;
  }

  /**
   * handle pattern:
   * import ...;
   */
  private async visitIPath(path: ImplementedNode[], node: ImportDeclaration): Promise<void> {
    if (node?.source?.value) {
      const dep = await this.asyncImportLiteralSource(node.source.value as string);
      node.specifiers?.forEach((specifier: any) => {
        this.identifierDepMap[specifier.local?.name as string] = dep;
      });
    }
  }

  /**
   * handle pattern:
   * export { default } from './xxx';
   */
  private async visitELPath(path: any[], node: Literal): Promise<void> {
    if (node.value) {
      const dep = await this.asyncImportLiteralSource(node.value as string);
      if (dep) {
        this.defaultExport = dep.visitorFileDependency.defaultExport;
      }
    }
  }

  /**
   * handle pattern:
   * export * from './xxx';
   */
  private async visitPELPath(path: any[], node: Literal): Promise<void> {
    if (node.value) {
      const dep = await this.asyncImportLiteralSource(node.value as string);
      if (dep) {
        this.exports = { ...this.exports, ...dep.visitorFileDependency.exports };
      }
    }
  }

  /**
   * handler pattern:
   * export const foo = ...;
   */
  private async visitEVVPath(path: any[], node: Identifier): Promise<void> {
    const scopeName: string = node.name;
    const exportScope = this.program.visitorTopScope.scopeMap[scopeName];
    if (exportScope instanceof LogicTopScope) {
      this.exports[scopeName as string] = exportScope;
    }
  }

  /**
   * handle pattern:
   * export default foo;
   */
  private async visitPEIPath(path: any[], node: Identifier): Promise<void> {
    const scopeName: string = node.name as string;
    const exportScope = this.program.visitorTopScope.scopeMap[scopeName];
    if (exportScope instanceof LogicTopScope) {
      this.defaultExport = exportScope;
    }
  }
}
