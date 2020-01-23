import * as fs from 'fs';
import * as path from 'path';

import { Program } from '../program';
import { ConcreteNode } from '../node/astNode';
import { NodeImportDeclarationVisitable } from '../node/astTypes';
import { AbsVisitor } from './absVisitor';
import { fileExists } from '../../utils';

export class ProgramVisitor extends AbsVisitor implements NodeImportDeclarationVisitable {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  private dirPath: string;

  private dependencies: Program[] = [];

  constructor(dirPath: string) {
    super();
    this.dirPath = dirPath;
  }

  public async visitImportDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void> {
    if (astNode?.source?.value) {
      if (astNode.source.value.charAt(0) !== '.') {
        return;
      }

      const originPath = path.resolve(this.dirPath, astNode.source.value);
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
}
