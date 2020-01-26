import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as toml from 'toml';
import * as extend from 'deep-extend';

export interface Config {
  rootDir: string;
  sourceFolder: string;
  entranceFile: string;
  debug?: {
    on: boolean;
    output: string;
    rootDir: string;
  };
  meta?: {
    type: boolean;
  };
}

const rootPath = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;

// merge config
let configObj: Config = {
  rootDir: rootPath,
  sourceFolder: '',
  entranceFile: '',
};

export const config = configObj;

export async function readConf(): Promise<void> {
  // parse default config
  const defaultConfigFile = fs.readFileSync(path.resolve('.default.toml')).toString();
  const defaultConfig = toml.parse(defaultConfigFile);

  // parse custom config
  const configFilePath = path.resolve(rootPath, '.remarx.toml');
  const configBuffer = fs.readFileSync(configFilePath);
  const customConfigObj = toml.parse(configBuffer.toString());
  customConfigObj.rootDir = rootPath;

  extend(configObj, defaultConfig, customConfigObj);

  if (configObj?.debug?.on) {
    configObj.debug.rootDir = path.resolve(rootPath, configObj.debug.output);
  }
}
