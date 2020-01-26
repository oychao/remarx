import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@typescript-eslint/typescript-estree';

import { config } from '../config';
import { PARSE_CONFIG } from '../constants';
import { simplifyAst, outputType } from '../utils';
import { ConcreteNode } from './node/astNode';
import { ProgramBase } from './programBase';
import { VisitorFileDependency } from './visitor/visitorFileDependency';
import { VisitorScopeDependency } from './visitor/visitorScopeDependency';
import { VisitorTopScope } from './visitor/visitorTopScope';

export class Program extends ProgramBase {
  public static pool: { [key: string]: Program } = {};

  public static produce(fullPath: string) {
    let ret: Program | null = Program.pool[fullPath];
    if (!ret) {
      ret = new Program(fullPath);
      Program.pool[fullPath] = ret;
    }
    return ret;
  }

  private initialized: boolean = false;

  public fullPath: string;
  protected rootAst: ConcreteNode | undefined;

  protected visitorTopScope: VisitorTopScope = new VisitorTopScope(this);
  protected visitorFileDependency: VisitorFileDependency = new VisitorFileDependency(this, this.dirPath);
  protected visitorScopeDependency: VisitorScopeDependency = new VisitorScopeDependency(this);

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
  }

  public async parse(): Promise<void> {
    if (this.initialized) {
      return;
    }
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

    // parse file dependencies
    await this.rootAst.accept(this.visitorFileDependency);

    // parse top block scope
    await this.rootAst.accept(this.visitorTopScope);

    // parse scope dependencies
    await this.rootAst.accept(this.visitorScopeDependency);

    // mark as initialized
    this.initialized = true;
  }

  public async forEachDepFile(cb: (dep: Program, index?: number, deps?: Program[]) => Promise<void>): Promise<void> {
    for (let i = 0; i < this.visitorFileDependency.dependencies.length; i++) {
      const dep = this.visitorFileDependency.dependencies[i];
      cb.call(null, dep, i, this.visitorFileDependency.dependencies);
    }
  }
}
