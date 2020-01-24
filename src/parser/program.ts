import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@typescript-eslint/typescript-estree';

import { config } from '../config';
import { PARSE_CONFIG } from '../constants';
import { simplifyAst, outputType } from '../utils';
import { ConcreteNode } from './node/astNode';
import { ProgramBase } from './programBase';
import { VisitorProgram } from './visitor/visitorProgram';

export class Program extends ProgramBase {
  protected fullPath: string;
  protected rootAst: ConcreteNode | undefined;

  protected visitorProgram: VisitorProgram = new VisitorProgram(this.dirPath);

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
  }

  public async parse(): Promise<void> {
    const enterFileBuffer = await fs.promises.readFile(this.fullPath);
    const enterFileStr = enterFileBuffer.toString();
    const astObj = simplifyAst(parser.parse(enterFileStr, PARSE_CONFIG));

    if (config?.meta?.type) {
      outputType(astObj);
    }

    if (config.debug?.on) {
      const astStr = JSON.stringify(astObj, null, 2);
      const astDir = this.dirPath.replace(config.rootDir, config.debug.rootDir);
      try {
        await fs.promises.access(astDir);
      } catch {
        await fs.promises.mkdir(astDir, { recursive: true });
      }
      const astFullPath = path.resolve(astDir, `${this.filename}.json`);
      await fs.promises.writeFile(astFullPath, astStr);
    }
    this.rootAst = new ConcreteNode(astObj);

    // parse dependencies
    await this.rootAst.accept(this.visitorProgram);
  }
}
