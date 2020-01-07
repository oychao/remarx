import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as toml from 'toml';

export async function parseConfig() {
  const rootPath = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
  const configFilePath = path.resolve(rootPath, '.remarx.toml');
  const configBuffer = await fs.promises.readFile(configFilePath);
  const configObj = toml.parse(configBuffer.toString());

  configObj.root = rootPath;

  return configObj;
}
