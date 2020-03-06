import { startWithCapitalLetter } from '../../utils';
import { ExtendedNode } from '../astNodes/extendedNode';
import { LogicProgramCommon } from '../programs/logicProgramCommon';
import { LogicNode } from '../logicNode';

export type TopScopeDepend = LogicAbstractDepNode | string | undefined;

export enum TOP_SCOPE_TYPE {
  Hook = 'Hook',
  FunctionComponent = 'FunctionComponent',
  ClassComponent = 'ClassComponent',
  Unknown = 'Unknown',
}

export interface TopScopeMap {
  [key: string]: TopScopeDepend | TopScopeMap;
}

export abstract class LogicAbstractDepNode extends LogicNode {
  public static async dfsWalkTopScopeMap(
    scopeDepMap: TopScopeMap,
    cb: (dep: TopScopeDepend, key: string, deps?: TopScopeMap) => Promise<void>
  ): Promise<void> {
    for (const key in scopeDepMap) {
      if (scopeDepMap.hasOwnProperty(key)) {
        const dep = scopeDepMap[key];
        if (dep instanceof LogicAbstractDepNode || typeof dep === 'string') {
          await cb.call(null, dep, key, scopeDepMap);
        } else if (typeof dep === 'object') {
          LogicAbstractDepNode.dfsWalkTopScopeMap(dep, cb);
        }
      }
    }
  }

  public name: string;

  public program: LogicProgramCommon;

  public scopeDepMap: TopScopeMap = {};

  public type: TOP_SCOPE_TYPE;

  constructor(name: string, astNode: ExtendedNode<LogicAbstractDepNode>, program: LogicProgramCommon) {
    super(astNode);
    this.name = name;
    this.program = program;
    if (name.slice(0, 3) === 'use') {
      this.type = TOP_SCOPE_TYPE.Hook;
    } else if (startWithCapitalLetter(name)) {
      this.type = TOP_SCOPE_TYPE.FunctionComponent;
    } else {
      this.type = TOP_SCOPE_TYPE.Unknown;
    }
  }

  public get depSign(): string {
    return `${this.program.fullPath}#${this.name}`;
  }

  public async forEachDepScope(
    cb: (dep: TopScopeDepend, key: string, deps?: TopScopeMap) => Promise<void>
  ): Promise<void> {
    await LogicAbstractDepNode.dfsWalkTopScopeMap(this.scopeDepMap, cb);
  }
}
