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

export interface NodeImportDefaultSpecifierVisitable {
  visitImportDefaultSpecifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
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

export interface NodeJSXClosingElementVisitable {
  visitJSXClosingElement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeExportNamedDeclarationVisitable {
  visitExportNamedDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeExportSpecifierVisitable {
  visitExportSpecifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeImportSpecifierVisitable {
  visitImportSpecifier(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeVariableDeclarationVisitable {
  visitVariableDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeVariableDeclaratorVisitable {
  visitVariableDeclarator(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeArrowFunctionExpressionVisitable {
  visitArrowFunctionExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeBlockStatementVisitable {
  visitBlockStatement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeArrayPatternVisitable {
  visitArrayPattern(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeObjectExpressionVisitable {
  visitObjectExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodePropertyVisitable {
  visitProperty(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeArrayExpressionVisitable {
  visitArrayExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeReturnStatementVisitable {
  visitReturnStatement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeJSXMemberExpressionVisitable {
  visitJSXMemberExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeJSXAttributeVisitable {
  visitJSXAttribute(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeJSXExpressionContainerVisitable {
  visitJSXExpressionContainer(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeExportDefaultDeclarationVisitable {
  visitExportDefaultDeclaration(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSTypeParameterInstantiationVisitable {
  visitTSTypeParameterInstantiation(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSTypeLiteralVisitable {
  visitTSTypeLiteral(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSPropertySignatureVisitable {
  visitTSPropertySignature(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSTypeAnnotationVisitable {
  visitTSTypeAnnotation(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSTypeReferenceVisitable {
  visitTSTypeReference(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSQualifiedNameVisitable {
  visitTSQualifiedName(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeUnaryExpressionVisitable {
  visitUnaryExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSNumberKeywordVisitable {
  visitTSNumberKeyword(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeFunctionExpressionVisitable {
  visitFunctionExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeSwitchStatementVisitable {
  visitSwitchStatement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeSwitchCaseVisitable {
  visitSwitchCase(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeAssignmentExpressionVisitable {
  visitAssignmentExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeTSAsExpressionVisitable {
  visitTSAsExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeBreakStatementVisitable {
  visitBreakStatement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeSpreadElementVisitable {
  visitSpreadElement(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeUpdateExpressionVisitable {
  visitUpdateExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeBinaryExpressionVisitable {
  visitBinaryExpression(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}

export interface NodeObjectPatternVisitable {
  visitObjectPattern(astNode: ConcreteNode, astPath: ConcreteNode[]): Promise<void>;
}
