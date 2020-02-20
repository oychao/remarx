import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { config, readConf } from './config';
import { __projectRoot } from './constants';
import { DependencyGraph } from './parser/dependencyGraph';
import { LogicProgramCommon } from './parser/node/logicProgramCommon';

async function parseProject(): Promise<
  | {
      topScopeGraphData: GraphView;
      fileGraphData: GraphView;
    }
  | undefined
> {
  try {
    // project source code root directory
    const projectSourceRootDir = path.resolve(config.rootDir, config.sourceFolder);
    // entrance file
    const enterPath = path.resolve(projectSourceRootDir, config.entranceFile);

    const depGraph = new DependencyGraph(enterPath);
    await depGraph.parse();

    const [fileGraphData, topScopeGraphData] = await Promise.all([
      await depGraph.getFileDepDag(),
      await depGraph.getTopScopeDag(),
    ]);

    // vscode.window.showInformationMessage('done');
    return {
      topScopeGraphData,
      fileGraphData,
    };
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
    return undefined;
  }
}

async function startViewServer(): Promise<void> {}

let panel: vscode.WebviewPanel | undefined;
export async function main(): Promise<void> {
  await readConf();
  await startViewServer();

  if (!panel) {
    // open panel
    panel = vscode.window.createWebviewPanel('remarx', 'Remarx', vscode.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.resolve(__projectRoot, 'view', 'dist'))],
    });

    panel.webview.onDidReceiveMessage(({ action, payload }: ViewAction) => {
      switch (action) {
        case 'OpenFile':
          vscode.workspace.openTextDocument(payload.path).then(doc => vscode.window.showTextDocument(doc));
          break;
        default:
          break;
      }
    });
    panel.onDidDispose(() => {
      panel = undefined;
    });
  }

  if (panel) {
    const graphData = await parseProject();

    await fs.promises.writeFile(
      path.resolve(__projectRoot, 'view', 'src', 'store', 'data.json'),
      JSON.stringify(graphData, null, 2)
    );

    // update panel view
    const viewSource = (await fs.promises.readFile(path.resolve(__projectRoot, 'view', 'dist', 'index.html')))
      .toString()
      .replace('VSCODE_RESOURCE_BASE', `${path.resolve(__projectRoot, 'view', 'dist')}/`)
      .replace(
        'VSCODE_DATA_DEF',
        `<script type="text/javascript">window.graphData = ${JSON.stringify(graphData)}</script>`
      );

    panel.webview.html = viewSource;
  }

  // purge all cached programs
  LogicProgramCommon.purge();
}
