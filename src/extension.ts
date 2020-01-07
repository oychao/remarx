import * as vscode from 'vscode';

import { main } from './main';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.helloWorld', main);
  context.subscriptions.push(disposable);
}

export function deactivate() {}
