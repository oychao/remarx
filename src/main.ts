import * as dagre from 'dagre';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise';
import * as vscode from 'vscode';

import { config } from './config';
import { DependencyGraph } from './parser/dependencyGraph';
import { __projectRoot } from './utils';

export async function resolveData(depGraph: DependencyGraph): Promise<GraphView> {
  const { files, depRelations } = await depGraph.getFileDepDag();
  const g = new dagre.graphlib.Graph();

  g.setGraph({});
  g.setDefaultEdgeLabel(() => ({}));

  files.forEach(file => {
    g.setNode(file, { label: file, width: 50, height: 50 });
  });
  depRelations.forEach(([from, to]) => {
    g.setEdge(from, to);
  });

  dagre.layout(g);

  return {
    nodes: g.nodes().map(n => g.node(n)),
    edges: g.edges().map(e => g.edge(e)),
  };
}

export async function parseProject(): Promise<GraphView | null> {
  try {
    // project source code root directory
    const projectSourceRootDir = path.resolve(config.rootDir, config.sourceFolder);
    // entrance file
    const enterPath = path.resolve(projectSourceRootDir, config.entranceFile);

    const depGraph = new DependencyGraph(enterPath);
    await depGraph.parse();

    const graphData = await resolveData(depGraph);

    return graphData;
    // vscode.window.showInformationMessage('done');
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
    return null;
  }
}

export async function main(): Promise<void> {
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
}
