import * as parser from '@typescript-eslint/typescript-estree';
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
import * as path from 'path';

import { config } from '../../config';
import { PARSE_CONFIG } from '../../constants';
import { simplifyAst } from '../../utils';
import { ImplementedNode } from './implementedNode';
import { LogicProgramBase } from './logicProgramBase';
import { VisitorFileDependency } from '../visitor/visitorFileDependency';
import { VisitorTopScope } from '../visitor/visitorTopScope';
import { ImplementedScope } from './implementedScope';
import { parseAstToImplementedNode } from './nodeFactory';

export class LogicProgramCommon extends LogicProgramBase {
  public static pool: { [key: string]: LogicProgramCommon } = {};

  public static produce(fullPath: string) {
    let ret: LogicProgramCommon | undefined = LogicProgramCommon.pool[fullPath];
    if (!ret) {
      ret = new LogicProgramCommon(fullPath);
      LogicProgramCommon.pool[fullPath] = ret;
    }
    return ret;
  }

  public static purge(): void {
    LogicProgramCommon.pool = {};
  }

  public static getPossibleImplementedNodeConstructor(type: AST_NODE_TYPES): typeof ImplementedNode {
    switch (type) {
      case AST_NODE_TYPES.BlockStatement:
        return ImplementedScope;
      default:
        return ImplementedNode;
    }
  }

  protected astNode: ImplementedNode | undefined;

  private initialized: boolean = false;

  public fullPath: string;

  public visitorTopScope: VisitorTopScope = new VisitorTopScope(this);
  public visitorFileDependency: VisitorFileDependency = new VisitorFileDependency(this, this.dirPath);

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
    this.astNode = parseAstToImplementedNode(astObj);

    // parse top block scope and dependencies
    await this.astNode.accept(this.visitorTopScope);

    // parse file dependencies
    await this.astNode.accept(this.visitorFileDependency);

    // mark as initialized
    this.initialized = true;
  }

  public async forEachDepFile(
    cb: (dep: LogicProgramCommon, index?: number, deps?: LogicProgramCommon[]) => Promise<void>
  ): Promise<void> {
    for (let i = 0; i < this.visitorFileDependency.imports.length; i++) {
      const dep = this.visitorFileDependency.imports[i];
      cb.call(null, dep, i, this.visitorFileDependency.imports);
    }
  }
}
