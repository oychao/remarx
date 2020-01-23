import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as parser from '@typescript-eslint/typescript-estree';

import { config } from './config';
import { PARSE_CONFIG } from './constants';
import { simplifyAst, outputType } from './utils';
import { ConcreteNode } from './parser/node/astNode';
import { ProgramVisitor } from './parser/visitor/programVisitor';

const fileAstMap = {};

export async function parseProject(): Promise<void> {
  try {
    // project source code root directory
    const projectSourceRootDir = path.resolve(config.root, config.main.sourceFolder);
    // entrance file
    const enterPath = path.resolve(projectSourceRootDir, config.main.entranceFile);
    const enterFileBuffer = await fs.promises.readFile(enterPath);
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

    const astRoot = new ConcreteNode(astObj);
    const programVisitor = new ProgramVisitor();
    astRoot.accept(programVisitor);

    vscode.window.showInformationMessage('done');
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export async function main(): Promise<void> {
  await parseProject();
}
