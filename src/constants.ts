export enum AstType {
  Program = 'Program',
}

export enum ProgramSourceType {
  script = 'script',
}

export enum VariableDeclarationType {
  const = 'const',
  let = 'let',
}

export interface AstNode {
  type: AstType;
  body?: AstNode[];
  declarations?: AstNode[];
  id?: AstNode;
  name?: string;
  init: AstNode;
  kind?: VariableDeclarationType;
  generator?: boolean;
  params?: AstNode[];
  callee?: AstNode;
  object?: AstNode;
  property?: AstNode;
  computed?: boolean;
  optional?: boolean;
  arguments?: AstNode;
  async?: boolean;
  expression?: boolean;
  typeAnnotation?: AstNode;
  range?: [number, number];
  sourceType?: ProgramSourceType;
  loc?: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
}
