import * as fs from 'fs';
import * as path from 'path';

import { Program } from '../program';
import { ConcreteNode } from '../node/astNode';
import { NodeImportDeclarationVisitable, NodeExportNamedDeclarationVisitable } from '../node/astTypes';
import { Visitor } from './visitor';
import { fileExists } from '../../utils';

export class ProgramVisitor extends Visitor
  implements NodeImportDeclarationVisitable, NodeExportNamedDeclarationVisitable {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  private dirPath: string;

  private dependencies: Program[] = [];

  constructor(dirPath: string) {
    super();
    this.dirPath = dirPath;
  }

  private async asyncImportLiteralSource(sourceValue: string): Promise<void> {
    if (sourceValue) {
      if (sourceValue.charAt(0) !== '.') {
        return;
      }

      const originPath = path.resolve(this.dirPath, sourceValue);
      let possiblePath = originPath;
      let isFile = await fileExists(possiblePath);
      let i = 0;
      // determine readable target module full path;
      while (!isFile && i < ProgramVisitor.POSSIBLE_FILE_SUFFIXES.length) {
        possiblePath = `${originPath}${ProgramVisitor.POSSIBLE_FILE_SUFFIXES[i++]}`;
        isFile = await fileExists(possiblePath);
      }

      const suffix = possiblePath.split('.').pop();
      if (suffix !== 'ts' && suffix !== 'tsx') {
        return;
      }

      const dep = new Program(possiblePath);
      await dep.parse();
      this.dependencies.push(dep);
    }
  }

  public async visitImportDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    if (astNode?.source?.value) {
      await this.asyncImportLiteralSource(astNode.source.value);
    }
  }

  public async visitExportNamedDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    if (astNode?.source?.value) {
      await this.asyncImportLiteralSource(astNode.source.value);
    }
  }
}
