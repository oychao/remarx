import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import * as path from 'path';

import { getConfig } from '../config';
import { BaseNodeDescendant, ExtendedNode } from '../parser/astNodes/extendedNode';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { fileExists } from '../utils';
import { TOP_SCOPE_TYPE } from '../parser/compDeps/logicAbstractDepNode';

export type NodeHandler = (
  path: ExtendedNode[],
  node: BaseNodeDescendant,
  parent: BaseNodeDescendant,
  grantParent: BaseNodeDescendant
) => Promise<void>;

export type DepPluginExpression = Array<AST_NODE_TYPES | DepPluginToken> | string;

export type DepPluginHandlerMap = {
  selector: DepPluginExpression;
  handlerName: string;
};

// must start with two underscores
export enum DepPluginToken {
  KwChild = '__KwChild',
  KwDescent = '__KwDescent',
  KwLoopStart = '__KwLoopStart',
  KwLoopEnd = '__KwLoopEnd',
}

/**
 * abstract plugin, supply a common visit method, every concrete ast node which accept plugin instance
 * would be visited by specific method of corresponding decent concrete plugin.
 */
export abstract class DepPlugin {
  // effective dependency types
  public static EFFECTIVE_DEP_TYPES = [
    TOP_SCOPE_TYPE.Hook,
    TOP_SCOPE_TYPE.ClassComponent,
    TOP_SCOPE_TYPE.FunctionComponent,
  ];

  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  public static parseDepPluginString(plugin: string): Array<AST_NODE_TYPES | DepPluginToken> {
    return [...plugin.trim().matchAll(/(>|L:\(|\)|[a-zA-Z_]+|\s+)/g)]
      .map(m => {
        const strToken = m[0].replace(/\s{1,}/, ' ');
        return DepPlugin.abbrs[strToken] || DepPlugin.pluginKwKws[strToken];
      })
      .filter((token: AST_NODE_TYPES | DepPluginToken, idx, arr) => {
        if (!token) {
          return false;
        }
        if (DepPluginToken.KwDescent !== token) {
          return true;
        }
        const prevToken = arr[idx - 1] || '';
        const nextToken = arr[idx + 1] || '';
        return !DepPlugin.isDepPluginToken(prevToken) && !DepPlugin.isDepPluginToken(nextToken);
      });
  }

  private static isDepPluginToken(token: string) {
    return token.slice(0, 2) === '__';
  }

  public static readonly pluginKwKws: { [key: string]: DepPluginToken } = {
    '>': DepPluginToken.KwChild,
    'L:(': DepPluginToken.KwLoopStart,
    ')': DepPluginToken.KwLoopEnd,
    ' ': DepPluginToken.KwDescent,
  };

  private static readonly abbrs: { [key: string]: AST_NODE_TYPES } = {
    p: AST_NODE_TYPES.Program,
    imp_dton: AST_NODE_TYPES.ImportDeclaration,
    exp_n_dton: AST_NODE_TYPES.ExportNamedDeclaration,
    exp_a_dton: AST_NODE_TYPES.ExportAllDeclaration,
    exp_d_dton: AST_NODE_TYPES.ExportDefaultDeclaration,
    lit: AST_NODE_TYPES.Literal,
    idt: AST_NODE_TYPES.Identifier,
    v_dton: AST_NODE_TYPES.VariableDeclaration,
    v_dtor: AST_NODE_TYPES.VariableDeclarator,
    f_dton: AST_NODE_TYPES.FunctionDeclaration,
    f_exp: AST_NODE_TYPES.FunctionExpression,
    af_exp: AST_NODE_TYPES.ArrowFunctionExpression,
    cl: AST_NODE_TYPES.CallExpression,
    jsx_ele: AST_NODE_TYPES.JSXElement,
    jsx_o_ele: AST_NODE_TYPES.JSXOpeningElement,
    jsx_mem_exp: AST_NODE_TYPES.JSXMemberExpression,
    jsx_idt: AST_NODE_TYPES.JSXIdentifier,
    blk: AST_NODE_TYPES.BlockStatement,
    cls_dton: AST_NODE_TYPES.ClassDeclaration,
  };

  protected program: LogicProgramCommon;

  constructor(program: LogicProgramCommon) {
    this.program = program;
  }

  protected rectifyAbsolutePath(sourceValue: string): string {
    if ('.' === sourceValue.charAt(0)) {
      return path.resolve(this.program.dirPath, sourceValue);
    } else {
      this.program.fileDepMap[sourceValue] = sourceValue;
      const { alias, sourceFolder, rootDir } = getConfig();
      if (!alias) {
        return undefined;
      }
      const keys = Object.keys(alias);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = alias[key];
        if (sourceValue.startsWith(key)) {
          return path.resolve(rootDir, sourceFolder, sourceValue.replace(key, value));
        }
      }
    }
    return null;
  }

  protected async asyncImportLiteralSource(sourceValue: string): Promise<LogicProgramCommon | undefined> {
    if (sourceValue && typeof sourceValue === 'string') {
      const originPath: string = this.rectifyAbsolutePath(sourceValue);

      if (!originPath) {
        return undefined;
      }

      let possiblePath = originPath;
      let isFile = await fileExists(possiblePath);
      let i = 0;

      // determine readable target module full path;
      while (!isFile && i < DepPlugin.POSSIBLE_FILE_SUFFIXES.length) {
        possiblePath = `${originPath}${DepPlugin.POSSIBLE_FILE_SUFFIXES[i++]}`;
        isFile = await fileExists(possiblePath);
      }

      const suffix = possiblePath.split('.').pop();
      if (suffix !== 'ts' && suffix !== 'tsx') {
        return undefined;
      }

      const dep = await LogicProgramCommon.produce(possiblePath);
      this.program.fileDepMap[possiblePath] = dep;
      return dep;
    }
    return undefined;
  }

  private matchDepPlugins(path: ExtendedNode[]): NodeHandler | undefined {
    const selectorHandlerMap = (this as any).getDepPluginHandlerMap ? (this as any).getDepPluginHandlerMap() : [];

    for (let i = 0; i < selectorHandlerMap.length; i++) {
      const { selector, handlerName } = selectorHandlerMap[i];
      const handler = (this as any)[handlerName];
      const selectorTokens = typeof selector === 'string' ? DepPlugin.parseDepPluginString(selector) : [...selector];
      let j = selectorTokens.length - 1;
      let k = path.length - 1;
      let currNodeToken = selectorTokens[j];
      let upLevelDepPluginToken = selectorTokens[--j];
      let currPathNode = path[k];
      let jumpToEnd = false;
      while (currNodeToken && currPathNode) {
        if (currNodeToken !== currPathNode.type) {
          jumpToEnd = true;
          break;
        }
        currNodeToken = selectorTokens[--j];
        upLevelDepPluginToken = selectorTokens[--j];
        currPathNode = path[--k];

        // TODO implement plugin token logic
        switch (upLevelDepPluginToken) {
          case DepPluginToken.KwChild:
            break;
          case DepPluginToken.KwDescent:
            break;
          default:
            break;
        }
      }
      if (jumpToEnd) {
        continue;
      }
      if (j < 0) {
        return handler as NodeHandler;
      }
    }
    return undefined;
  }

  public async visit(node: ExtendedNode, path: ExtendedNode[] = []): Promise<void> {
    path.push(node);
    const handler = this.matchDepPlugins(path);

    if (handler) {
      await handler.call(this, path, node, path[path.length - 2], path[path.length - 3]);
    }

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = (node as any)[key];
        if (value instanceof ExtendedNode) {
          await value.accept(this, [...path]);
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const subValue = value[i];
            if (subValue instanceof ExtendedNode) {
              await subValue.accept(this, [...path]);
            }
          }
        }
      }
    }
    path.pop();
  }
}

const classDepPluginMap: { [key: string]: DepPluginHandlerMap[] } = {};
export const selector = function(selectorString: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!classDepPluginMap[target.constructor.name]) {
      classDepPluginMap[target.constructor.name] = [];
    }

    if (!target.getDepPluginHandlerMap) {
      target.getDepPluginHandlerMap = function() {
        return classDepPluginMap[target.constructor.name];
      };
    }

    classDepPluginMap[target.constructor.name].push({
      selector: selectorString,
      handlerName: propertyKey,
    });
  };
};
