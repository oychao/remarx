import * as fs from 'fs';
import * as path from 'path';

export const __projectRoot = path.resolve(__dirname, '..');

export function dfsWalk(root: object, cb: (obj: object) => void): void {
  if (!root) {
    return;
  }
  cb(root);
  Object.values(root).forEach((val: object) => {
    if (Array.isArray(val) || typeof val === 'object') {
      dfsWalk(val, cb);
    }
  });
}

export function simplifyAst<T extends object>(ast: T): T {
  dfsWalk(ast, node => {
    delete (node as any).range;
    delete (node as any).loc;
  });
  return ast;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return (await fs.promises.lstat(filePath)).isFile();
  } catch {
    return false;
  }
}

export function startWithCapitalLetter(str: string): boolean {
  const charCode = str.charCodeAt(0);
  return charCode > 64 && charCode < 91;
}
