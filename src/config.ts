import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as toml from 'toml';
import * as extend from 'deep-extend';

export interface Config {
  root: string;
  main: {
    sourceFolder: string;
    entranceFile: string;
  };
  debug?: {
    astDir: string;
  };
}

// parse default config
const defaultConfigFile = fs.readFileSync(path.resolve('.default.toml')).toString();
const defaultConfig = toml.parse(defaultConfigFile);

// parse custom config
const rootPath = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
const configFilePath = path.resolve(rootPath, '.remarx.toml');
const configBuffer = fs.readFileSync(configFilePath);
const customConfigObj = toml.parse(configBuffer.toString());
customConfigObj.root = rootPath;

// merge config
const configObj: Config = {
  root: rootPath,
  main: {
    sourceFolder: '',
    entranceFile: '',
  },
};
extend(configObj, defaultConfig, customConfigObj);

export const config = Object.seal(configObj);
