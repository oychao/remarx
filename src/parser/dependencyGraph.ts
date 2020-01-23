import * as fs from 'fs';
import * as parser from '@typescript-eslint/typescript-estree';

import { PARSE_CONFIG } from '../constants';
import { simplifyAst } from '../utils';
import { ParserBase } from './parserBase';
import { ProgramVisitor } from './visitor/programVisitor';
import { Program } from './program';

export class DependencyGraph extends ParserBase {
  protected rootPath: string;
  private program: Program;

  constructor(rootPath: string) {
    super();
    this.rootPath = rootPath;
    this.program = new Program(this.rootPath);
  }

  public async parse(): Promise<void> {
    await this.program.parse();
  }

  public async draw(): Promise<void> {}
}
