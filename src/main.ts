import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise';
import * as vscode from 'vscode';

import { config, readConf } from './config';
import { DependencyGraph } from './parser/dependencyGraph';
import { __projectRoot } from './utils';
import { Program } from './parser/program';

export async function parseProject(): Promise<GraphView | null> {
  try {
    // project source code root directory
    const projectSourceRootDir = path.resolve(config.rootDir, config.sourceFolder);
    // entrance file
    const enterPath = path.resolve(projectSourceRootDir, config.entranceFile);

    const depGraph = new DependencyGraph(enterPath);
    await depGraph.parse();

    const graphData = await depGraph.getFileDepDag();

    return graphData;
    // vscode.window.showInformationMessage('done');
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
    return null;
  }
}

export async function main(): Promise<void> {
  await readConf();

  // open panel
  const panel = vscode.window.createWebviewPanel('remarx', 'Remarx', vscode.ViewColumn.One, {
    enableScripts: true,
  });
  panel.webview.onDidReceiveMessage(e => {
    console.log(e);
  });

  const graphData = await parseProject();
  await fs.promises.writeFile(
    path.resolve(__projectRoot, 'view', 'src', 'store', 'data.json'),
    JSON.stringify(graphData, null, 2)
  );

  // update panel view
  const viewSource = await request('http://localhost:9551/');
  panel.webview.html = viewSource;

  Program.purge();
}
