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
