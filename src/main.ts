import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as parser from '@typescript-eslint/typescript-estree';

import { parseConfig } from './configParser';

export async function main() {
  const config = await parseConfig();
  try {
    const enterPath = path.resolve(config.root, config.source.dir, config.source.index);
    const enterFileBuffer = await fs.promises.readFile(enterPath);
    const enterFileStr = enterFileBuffer.toString();

    const astStr = JSON.stringify(parser.parse(enterFileStr), null, 2);

    if (config.debug.ast) {
      const astFolder = path.resolve(config.root, config.debug.output);
      try {
        await fs.promises.access(astFolder);
      } catch (error) {
        fs.promises.mkdir(astFolder);
      }
      const astDir = path.resolve(astFolder, 'index.json');
      await fs.promises.writeFile(astDir, astStr);
    }

    vscode.window.showInformationMessage('done');
  } catch (error) {
    vscode.window.showErrorMessage(error.toString());
  }
}
