import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@typescript-eslint/typescript-estree';

import { config } from '../config';
import { PARSE_CONFIG } from '../constants';
import { simplifyAst, outputType } from '../utils';
import { ConcreteNode } from './node/astNode';
import { ParserBase } from './parserBase';
import { ProgramVisitor } from './visitor/programVisitor';

export class Program extends ParserBase {
  protected rootPath: string;
  private visitor: ProgramVisitor = new ProgramVisitor();
  private rootAst: ConcreteNode | undefined;

  constructor(rootPath: string) {
    super();
    this.rootPath = rootPath;
  }

  public async parse(): Promise<void> {
    const enterFileBuffer = await fs.promises.readFile(this.rootPath);
    const enterFileStr = enterFileBuffer.toString();
    const astObj = simplifyAst(parser.parse(enterFileStr, PARSE_CONFIG));

    outputType(astObj);

    if (config.debug?.astDir) {
      const astStr = JSON.stringify(astObj, null, 2);
      const astFolderPath = path.resolve(config.root, config.debug.astDir);

      try {
        await fs.promises.access(astFolderPath);
      } catch (error) {
        await fs.promises.mkdir(astFolderPath);
      }

      const astDir = path.resolve(astFolderPath, `${config.main.entranceFile}.json`);
      await fs.promises.writeFile(astDir, astStr);
    }
    this.rootAst = new ConcreteNode(astObj);
    await this.rootAst.accept(this.visitor);
  }
}
