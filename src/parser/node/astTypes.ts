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
