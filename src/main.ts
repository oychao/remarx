import * as vscode from 'vscode';
import * as path from 'path';

import { config } from './config';
import { DependencyGraph } from './parser/dependencyGraph';

export async function parseProject(): Promise<void> {
  try {
    // project source code root directory
    const projectSourceRootDir = path.resolve(config.root, config.main.sourceFolder);
    // entrance file
    const enterPath = path.resolve(projectSourceRootDir, config.main.entranceFile);

    const depGraph = new DependencyGraph(enterPath);
    await depGraph.parse();
    await depGraph.draw();

    vscode.window.showInformationMessage('done');
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export async function main(): Promise<void> {
  await parseProject();
}
