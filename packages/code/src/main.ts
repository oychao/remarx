import * as fs from 'fs';
import * as path from 'path';
import { Remarx } from 'remarx';
import * as vscode from 'vscode';

import { config, readConf } from './config';
import { __projectRoot } from './constants';

const __viewRoot = path.resolve(__projectRoot, 'view');

let initialized: boolean = false;
let panel: vscode.WebviewPanel | undefined;

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

    const depGraph = new Remarx(config, enterPath);
    await depGraph.parse();

    const [fileGraphData, topScopeGraphData] = await Promise.all([
      await depGraph.getFileDepDag(),
      await depGraph.getTopScopeDag(),
    ]);

    // vscode.window.showInformationMessage('done')
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

async function parseViewSource(): Promise<void> {
  if (!panel) {
    return;
  }

  const viewSourceTemplate = (await fs.promises.readFile(path.resolve(__viewRoot, 'index.html')))
    .toString()
    .replace('VSCODE_RESOURCE_BASE', `${path.resolve(__viewRoot)}/`);

  const graphData = await parseProject();
  const viewSource = viewSourceTemplate.replace(
    'VSCODE_DATA_DEF',
    `<script type="text/javascript">window.graphData = ${JSON.stringify(graphData)}</script>`
  );

  // update panel view
  panel.webview.html = viewSource;

  // purge all cached programs
  Remarx.purgeCache();
}

async function init(): Promise<void> {
  if (!initialized) {
    vscode.workspace.onDidSaveTextDocument(async (doc: vscode.TextDocument) => {
      console.log(doc.fileName);
      await parseViewSource();
    });
  }
  initialized = true;
}

export async function main(): Promise<void> {
  await readConf();
  await init();

  if (!panel) {
    // open panel
    panel = vscode.window.createWebviewPanel('remarx', 'Remarx', vscode.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.resolve(__projectRoot, 'view'))],
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

  await parseViewSource();
}