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
  ExportNamedDeclaration = 'ExportNamedDeclaration',
  ExportSpecifier = 'ExportSpecifier',
}

export interface NodeProgramVisitable {
  visitProgram(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeImportDeclarationVisitable {
  visitImportDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeLiteralVisitable {
  visitLiteral(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeImportNamespaceSpecifierVisitable {
  visitImportNamespaceSpecifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeIdentifierVisitable {
  visitIdentifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeImportSpecifierVisitable {
  visitImportSpecifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeExpressionStatementVisitable {
  visitExpressionStatement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeCallExpressionVisitable {
  visitCallExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeMemberExpressionVisitable {
  visitMemberExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeJSXElementVisitable {
  visitJSXElement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeJSXOpeningElementVisitable {
  visitJSXOpeningElement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeJSXIdentifierVisitable {
  visitJSXIdentifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeExportNamedDeclarationVisitable {
  visitExportNamedDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeExportSpecifierVisitable {
  visitExportSpecifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}
