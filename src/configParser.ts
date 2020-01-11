import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as toml from 'toml';
import * as extend from 'xtend';

const defaultConfig = {
  ast: false,
  output: './ast',
};

export async function parseConfig() {
  const rootPath = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
  const configFilePath = path.resolve(rootPath, '.remarx.toml');
  const configBuffer = await fs.promises.readFile(configFilePath);
  const customConfigObj = toml.parse(configBuffer.toString());
  customConfigObj.root = rootPath;

  const configObj = extend(defaultConfig, customConfigObj);

  return configObj;
}
