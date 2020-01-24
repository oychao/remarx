import * as dagre from 'dagre';
import * as fs from 'fs';
import * as path from 'path';
import * as pug from 'pug';
import * as vscode from 'vscode';

import { config } from './config';
import { DependencyGraph } from './parser/dependencyGraph';
import { __projectRoot } from './utils';

export interface GraphView {
  nodes: dagre.Node[];
  edges: dagre.GraphEdge[];
}

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

export async function renderView(data: GraphView): Promise<string> {
  const viewDir = path.resolve(__projectRoot, 'src', 'view');
  const outDir = path.resolve(__projectRoot, 'out', 'view');
  const template = (await fs.promises.readFile(path.resolve(viewDir, 'index.pug'))).toString();
  const script = (await fs.promises.readFile(path.resolve(outDir, 'index.js'))).toString();
  const ret = pug.render(template, {
    // declare a `exports` object to mock es module
    filters: { script: () => `const exports = {};const graphData = ${JSON.stringify(data)};${script}` },
  });
  return ret;
}

export async function parseProject(): Promise<void> {
  try {
    // project source code root directory
    const projectSourceRootDir = path.resolve(config.rootDir, config.sourceFolder);
    // entrance file
    const enterPath = path.resolve(projectSourceRootDir, config.entranceFile);

    // open panel
    const panel = vscode.window.createWebviewPanel('remarx', 'Remarx', vscode.ViewColumn.One, {
      enableScripts: true,
    });

    const depGraph = new DependencyGraph(enterPath);
    await depGraph.parse();

    const graphData = await resolveData(depGraph);
    const htmlDoc = await renderView(graphData);

    // update panel view
    panel.webview.html = htmlDoc;

    // vscode.window.showInformationMessage('done');
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export async function main(): Promise<void> {
  await parseProject();
}
