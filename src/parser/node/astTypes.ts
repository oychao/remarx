import { ConcreteNode } from './astNode';

export enum AstType {
  Program = 'Program',
  ImportDeclaration = 'ImportDeclaration',
  Literal = 'Literal',
  ImportNamespaceSpecifier = 'ImportNamespaceSpecifier',
  Identifier = 'Identifier',
  ImportSpecifier = 'ImportSpecifier',
  ExpressionStatement = 'ExpressionStatement',
  CallExpression = 'CallExpression',
  MemberExpression = 'MemberExpression',
  JSXElement = 'JSXElement',
  JSXOpeningElement = 'JSXOpeningElement',
  JSXIdentifier = 'JSXIdentifier',
}

export interface NodeProgramVisitable {
  visitProgram(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeImportDeclarationVisitable {
  visitImportDeclaration(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeLiteralVisitable {
  visitLiteral(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeImportNamespaceSpecifierVisitable {
  visitImportNamespaceSpecifier(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeIdentifierVisitable {
  visitIdentifier(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeImportSpecifierVisitable {
  visitImportSpecifier(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeExpressionStatementVisitable {
  visitExpressionStatement(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeCallExpressionVisitable {
  visitCallExpression(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeMemberExpressionVisitable {
  visitMemberExpression(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeJSXElementVisitable {
  visitJSXElement(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeJSXOpeningElementVisitable {
  visitJSXOpeningElement(element: ConcreteNode, path: ConcreteNode[]): void;
}

export interface NodeJSXIdentifierVisitable {
  visitJSXIdentifier(element: ConcreteNode, path: ConcreteNode[]): void;
}
