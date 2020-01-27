import * as path from 'path';

import { Program } from '../program';
import { ConcreteNode } from '../node/concreteNode';
import { AstType } from '../node/astTypes';
import { Visitor, SelectorHandlerMap } from './visitor';
import { fileExists } from '../../utils';

export class VisitorFileDependency extends Visitor {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  private dirPath: string;

  public dependencies: Program[] = [];

  public identifierDepMap: { [key: string]: Program | undefined } = {};

  constructor(program: Program, dirPath: string) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AstType.Program, AstType.ImportDeclaration],
        handler: this.visitIPath,
      },
      {
        selector: [AstType.ExportNamedDeclaration, AstType.Literal],
        handler: this.visitELPath,
      },
      {
        selector: [AstType.ExportNamedDeclaration, AstType.VariableDeclaration, AstType.VariableDeclarator],
        handler: this.visitEVVPath,
      },
    ];
    this.dirPath = dirPath;
  }

  private async asyncImportLiteralSource(sourceValue: string): Promise<Program | undefined> {
    if (sourceValue) {
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

      const dep = Program.produce(possiblePath);
      await dep.parse();
      this.dependencies.push(dep);
      return dep;
    }
    return undefined;
  }

  /**
   * handle pattern:
   * import ...;
   */
  private async visitIPath(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    if (node?.source?.value) {
      const dep = await this.asyncImportLiteralSource(node.source.value);
      node.specifiers?.forEach(specifier => {
        this.identifierDepMap[specifier.local?.name as string] = dep;
      });
    }
  }

  /**
   * handle pattern:
   * export { default } from './xxx';
   */
  private async visitELPath(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    if (node.value) {
      await this.asyncImportLiteralSource(node.value);
    }
  }

  /**
   * handler pattern:
   * export const foo = ...;
   */
  private async visitEVVPath(path: ConcreteNode[], node: ConcreteNode): Promise<void> {
    // TODO handle node below
    // {
    //   "type": "Identifier",
    //   "name": "CreateForm"
    // },
  }
}
