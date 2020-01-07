import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as parser from '@typescript-eslint/typescript-estree';

import { parseConfig } from './configParser';

export async function main() {
  const config = await parseConfig();
  try {
    const enterPath = path.resolve(config.root, config.main.dir, config.main.index);
    const enterFileBuffer = await fs.promises.readFile(enterPath);
    const enterFileStr = enterFileBuffer.toString();
    vscode.window.showInformationMessage(JSON.stringify(parser.parse(enterFileStr)));
  } catch (error) {
    vscode.window.showErrorMessage(error.toString());
  }
}
