const vscode = acquireVsCodeApi();

export async function openFile(path: string): Promise<void> {
  vscode.postMessage({
    action: 'OpenFile',
    payload: {
      path,
    },
  });
}
