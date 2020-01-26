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
export const __projectRoot = path.resolve(__dirname, '..');
const result: Set<string> = new Set();
export async function outputType(ast: object): Promise<void> {
  dfsWalk(ast, (node: any) => {
    if (!node.type) {
      return;
    }
    result.add(node.type);
  });
  const types = Array.from(result);
  await fs.promises.writeFile(
    path.resolve(__projectRoot, 'src', 'parser', 'node', 'astTypes.ts'),
    `import { ConcreteNode } from './astNode';

export enum AstType {\n${types.map(type => `  ${type} = '${type}'`).join(',\n')},\n}

${types
  .map(
    type => `export interface Node${type}Visitable {
  visit${type}(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}`
  )
  .join('\n\n')}
`
  );
}

// export async function fileExists(filePath: string): Promise<boolean> {
//   return new Promise(resolve => {
//     fs.access(filePath, fs.constants.F_OK, err => {
//       if (err) {
//         resolve(false);
//       }
//       fs.lstat(filePath, (err, stats) => {
//         if (err || !stats.isFile()) {
//           resolve(false);
//         } else {
//           resolve(true);
//         }
//       });
//     });
//   });
// }

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return (await fs.promises.lstat(filePath)).isFile();
  } catch {
    return false;
  }
}
