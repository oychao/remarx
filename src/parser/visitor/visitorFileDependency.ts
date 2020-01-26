import * as path from 'path';

import { Program } from '../program';
import { ConcreteNode } from '../node/astNode';
import { AstType } from '../node/astTypes';
import { Visitor, SelectorHandlerMap } from './visitor';
import { fileExists } from '../../utils';

export class VisitorFileDependency extends Visitor {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  private dirPath: string;

  public dependencies: Program[] = [];

  private identifierDepMap: { [key: string]: Program } = {};

  constructor(program: Program, dirPath: string) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.ImportDeclaration],
        handler: this.visitImportDeclaration,
      },
      {
        selector: [AstType.ExportNamedDeclaration],
        handler: this.visitExportNamedDeclaration,
      },
    ];
    this.dirPath = dirPath;
  }

  private async asyncImportLiteralSource(sourceValue: string): Promise<Program | null> {
    if (sourceValue) {
      if (sourceValue.charAt(0) !== '.') {
        return null;
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
        return null;
      }

      const dep = Program.produce(possiblePath);
      await dep.parse();
      this.dependencies.push(dep);
      return dep;
    }
    return null;
  }

  private async visitImportDeclaration(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    if (node?.source?.value) {
      const dep = await this.asyncImportLiteralSource(node.source.value);
      if (dep) {
        node.specifiers?.forEach(specifier => {
          this.identifierDepMap[specifier.local?.name as string] = dep;
        });
      }
    }
  }

  private async visitExportNamedDeclaration(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    if (node?.source?.value) {
      await this.asyncImportLiteralSource(node.source.value);
    }
    if (Array.isArray(node?.declaration?.declarations)) {
    }
  }
}
