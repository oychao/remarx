import * as path from 'path';

import { Program } from '../program';
import { ConcreteNode } from '../node/astNode';
import { NodeImportDeclarationVisitable, NodeExportNamedDeclarationVisitable } from '../node/astTypes';
import { Visitor } from './visitor';
import { fileExists } from '../../utils';

export class VisitorDependency extends Visitor
  implements NodeImportDeclarationVisitable, NodeExportNamedDeclarationVisitable {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  private dirPath: string;

  public dependencies: Program[] = [];

  private identifierDepMap: { [key: string]: Program } = {};

  constructor(program: Program, dirPath: string) {
    super(program);
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
      while (!isFile && i < VisitorDependency.POSSIBLE_FILE_SUFFIXES.length) {
        possiblePath = `${originPath}${VisitorDependency.POSSIBLE_FILE_SUFFIXES[i++]}`;
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

  public async visitImportDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    if (astNode?.source?.value) {
      const dep = await this.asyncImportLiteralSource(astNode.source.value);
      if (dep) {
        astNode.specifiers?.forEach(specifier => {
          this.identifierDepMap[specifier.local?.name as string] = dep;
        });
      }
    }
  }

  public async visitExportNamedDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    if (astNode?.source?.value) {
      await this.asyncImportLiteralSource(astNode.source.value);
    }
    if (Array.isArray(astNode?.declaration?.declarations)) {
    }
  }
}
