import { ConcreteNode } from './astNode';

export enum AstType {
  Program = 'Program',
  ImportDeclaration = 'ImportDeclaration',
  Literal = 'Literal',
  ImportNamespaceSpecifier = 'ImportNamespaceSpecifier',
  Identifier = 'Identifier',
  ImportDefaultSpecifier = 'ImportDefaultSpecifier',
  ExpressionStatement = 'ExpressionStatement',
  CallExpression = 'CallExpression',
  MemberExpression = 'MemberExpression',
  JSXElement = 'JSXElement',
  JSXOpeningElement = 'JSXOpeningElement',
  JSXIdentifier = 'JSXIdentifier',
  JSXClosingElement = 'JSXClosingElement',
  ExportNamedDeclaration = 'ExportNamedDeclaration',
  ExportSpecifier = 'ExportSpecifier',
  ImportSpecifier = 'ImportSpecifier',
  VariableDeclaration = 'VariableDeclaration',
  VariableDeclarator = 'VariableDeclarator',
  ArrowFunctionExpression = 'ArrowFunctionExpression',
  BlockStatement = 'BlockStatement',
  ArrayPattern = 'ArrayPattern',
  ObjectExpression = 'ObjectExpression',
  Property = 'Property',
  ArrayExpression = 'ArrayExpression',
  ReturnStatement = 'ReturnStatement',
  JSXMemberExpression = 'JSXMemberExpression',
  JSXAttribute = 'JSXAttribute',
  JSXExpressionContainer = 'JSXExpressionContainer',
  ExportDefaultDeclaration = 'ExportDefaultDeclaration',
  TSTypeParameterInstantiation = 'TSTypeParameterInstantiation',
  TSTypeLiteral = 'TSTypeLiteral',
  TSPropertySignature = 'TSPropertySignature',
  TSTypeAnnotation = 'TSTypeAnnotation',
  TSTypeReference = 'TSTypeReference',
  TSQualifiedName = 'TSQualifiedName',
  UnaryExpression = 'UnaryExpression',
  TSNumberKeyword = 'TSNumberKeyword',
  FunctionExpression = 'FunctionExpression',
  SwitchStatement = 'SwitchStatement',
  SwitchCase = 'SwitchCase',
  AssignmentExpression = 'AssignmentExpression',
  TSAsExpression = 'TSAsExpression',
  BreakStatement = 'BreakStatement',
  SpreadElement = 'SpreadElement',
  UpdateExpression = 'UpdateExpression',
  BinaryExpression = 'BinaryExpression',
  ObjectPattern = 'ObjectPattern',
  ConditionalExpression = 'ConditionalExpression',
  JSXFragment = 'JSXFragment',
  JSXOpeningFragment = 'JSXOpeningFragment',
  JSXClosingFragment = 'JSXClosingFragment',
  FunctionDeclaration = 'FunctionDeclaration',
  AssignmentPattern = 'AssignmentPattern',
  TSBooleanKeyword = 'TSBooleanKeyword',
  TSTupleType = 'TSTupleType',
  TSFunctionType = 'TSFunctionType',
  TSVoidKeyword = 'TSVoidKeyword',
}

export interface NodeProgramVisitable {
  visitProgram(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeImportDeclarationVisitable {
  visitImportDeclaration(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeLiteralVisitable {
  visitLiteral(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeImportNamespaceSpecifierVisitable {
  visitImportNamespaceSpecifier(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeIdentifierVisitable {
  visitIdentifier(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeImportDefaultSpecifierVisitable {
  visitImportDefaultSpecifier(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeExpressionStatementVisitable {
  visitExpressionStatement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeCallExpressionVisitable {
  visitCallExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeMemberExpressionVisitable {
  visitMemberExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXElementVisitable {
  visitJSXElement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXOpeningElementVisitable {
  visitJSXOpeningElement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXIdentifierVisitable {
  visitJSXIdentifier(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXClosingElementVisitable {
  visitJSXClosingElement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeExportNamedDeclarationVisitable {
  visitExportNamedDeclaration(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeExportSpecifierVisitable {
  visitExportSpecifier(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeImportSpecifierVisitable {
  visitImportSpecifier(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeVariableDeclarationVisitable {
  visitVariableDeclaration(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeVariableDeclaratorVisitable {
  visitVariableDeclarator(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeArrowFunctionExpressionVisitable {
  visitArrowFunctionExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeBlockStatementVisitable {
  visitBlockStatement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeArrayPatternVisitable {
  visitArrayPattern(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeObjectExpressionVisitable {
  visitObjectExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodePropertyVisitable {
  visitProperty(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeArrayExpressionVisitable {
  visitArrayExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeReturnStatementVisitable {
  visitReturnStatement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXMemberExpressionVisitable {
  visitJSXMemberExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXAttributeVisitable {
  visitJSXAttribute(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXExpressionContainerVisitable {
  visitJSXExpressionContainer(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeExportDefaultDeclarationVisitable {
  visitExportDefaultDeclaration(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSTypeParameterInstantiationVisitable {
  visitTSTypeParameterInstantiation(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSTypeLiteralVisitable {
  visitTSTypeLiteral(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSPropertySignatureVisitable {
  visitTSPropertySignature(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSTypeAnnotationVisitable {
  visitTSTypeAnnotation(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSTypeReferenceVisitable {
  visitTSTypeReference(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSQualifiedNameVisitable {
  visitTSQualifiedName(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeUnaryExpressionVisitable {
  visitUnaryExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSNumberKeywordVisitable {
  visitTSNumberKeyword(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeFunctionExpressionVisitable {
  visitFunctionExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeSwitchStatementVisitable {
  visitSwitchStatement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeSwitchCaseVisitable {
  visitSwitchCase(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeAssignmentExpressionVisitable {
  visitAssignmentExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSAsExpressionVisitable {
  visitTSAsExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeBreakStatementVisitable {
  visitBreakStatement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeSpreadElementVisitable {
  visitSpreadElement(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeUpdateExpressionVisitable {
  visitUpdateExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeBinaryExpressionVisitable {
  visitBinaryExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeObjectPatternVisitable {
  visitObjectPattern(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeConditionalExpressionVisitable {
  visitConditionalExpression(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXFragmentVisitable {
  visitJSXFragment(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXOpeningFragmentVisitable {
  visitJSXOpeningFragment(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeJSXClosingFragmentVisitable {
  visitJSXClosingFragment(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeFunctionDeclarationVisitable {
  visitFunctionDeclaration(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeAssignmentPatternVisitable {
  visitAssignmentPattern(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSBooleanKeywordVisitable {
  visitTSBooleanKeyword(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSTupleTypeVisitable {
  visitTSTupleType(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSFunctionTypeVisitable {
  visitTSFunctionType(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}

export interface NodeTSVoidKeywordVisitable {
  visitTSVoidKeyword(path: ConcreteNode[], node: ConcreteNode, parent: ConcreteNode, grantParent: ConcreteNode): Promise<void>;
}
