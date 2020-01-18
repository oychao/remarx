import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as parser from '@typescript-eslint/typescript-estree';

import { config } from './config';

export async function main() {
  try {
    const enterPath = path.resolve(config.root, config.main.sourceFolder, config.main.entranceFile);
    const enterFileBuffer = await fs.promises.readFile(enterPath);
    const enterFileStr = enterFileBuffer.toString();

    const astStr = JSON.stringify(parser.parse(enterFileStr), null, 2);

    if (config.debug?.astDir) {
      const astFolderPath = path.resolve(config.root, config.debug.astDir);
      try {
        await fs.promises.access(astFolderPath);
      } catch (error) {
        fs.promises.mkdir(astFolderPath);
      }
      const astDir = path.resolve(astFolderPath, 'index.json');
      await fs.promises.writeFile(astDir, astStr);
    }

    vscode.window.showInformationMessage('done');
  } catch (error) {
    vscode.window.showErrorMessage(error.toString());
  }
}
