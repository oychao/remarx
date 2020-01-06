import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as toml from 'toml';

export async function parseConfig() {
  const configFilePath = path.resolve(vscode.workspace.rootPath as string, '.remarx.toml');
  const configBuffer = await fs.promises.readFile(configFilePath);
  const configObj = toml.parse(configBuffer.toString());
  
  return configObj;
}
