import * as extend from 'deep-extend';
import * as fs from 'fs';
import * as path from 'path';
import * as toml from 'toml';
import * as vscode from 'vscode';

import { __projectRoot } from './constants';

export interface Config {
  rootDir: string;
  sourceFolder: string;
  entranceFile: string;
  debug?: {
    on: boolean;
    output: string;
    rootDir: string;
  };
  alias?: {
    [key: string]: string;
  };
  hof?: {
    ignore: Array<string>;
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
  const defaultConfigFile = fs.readFileSync(path.resolve(__projectRoot, '.default.toml')).toString();
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
