import * as fs from 'fs';
import * as path from 'path';

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

// output detected types from ast object into src/astTypes.ts file, meta programming?
const __projectRoot = path.resolve(__dirname, '..');
const result: Set<string> = new Set();
export async function outputType(ast: object) {
  dfsWalk(ast, (node: any) => {
    if (!node.type) {
      return;
    }
    result.add(node.type);
  });
  await fs.promises.writeFile(
    path.resolve(__projectRoot, 'src', 'astTypes.ts'),
    `export enum AstType {\n${Array.from(result)
      .map(type => `  ${type} = '${type}'`)
      .join(',\n')},\n}\n`
  );
}
