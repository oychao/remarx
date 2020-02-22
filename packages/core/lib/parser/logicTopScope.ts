import { startWithCapitalLetter } from '../utils';
import { ImplementedScope } from './implementedScope';
import { LogicProgramCommon } from './logicProgramCommon';
import { LogicScope } from './logicScope';

export type TopScopeDepend = LogicTopScope | string | undefined;

export enum TOP_SCOPE_TYPE {
  Hook = 'Hook',
  Component = 'Component',
  Unknown = 'Unknown',
}

export interface TopScopeMap {
  [key: string]: TopScopeDepend | TopScopeMap;
}

export class LogicTopScope extends LogicScope {
  public static async dfsWalkTopScopeMap(
    scopeDepMap: TopScopeMap,
    cb: (dep: TopScopeDepend, key: string, deps?: TopScopeMap) => Promise<void>
  ): Promise<void> {
    for (const key in scopeDepMap) {
      if (scopeDepMap.hasOwnProperty(key)) {
        const dep = scopeDepMap[key];
        if (dep instanceof LogicTopScope || typeof dep === 'string') {
          await cb.call(null, dep, key, scopeDepMap);
        } else if (typeof dep === 'object') {
          LogicTopScope.dfsWalkTopScopeMap(dep, cb);
        }
      }
    }
  }

  public name: string;

  public program: LogicProgramCommon;

  public scopeDepMap: TopScopeMap = {};

  public type: TOP_SCOPE_TYPE;

  constructor(name: string, astNode: ImplementedScope, program: LogicProgramCommon) {
    super(astNode);
    this.name = name;
    this.program = program;
    if (name.slice(0, 3) === 'use') {
      this.type = TOP_SCOPE_TYPE.Hook;
    } else if (startWithCapitalLetter(name)) {
      this.type = TOP_SCOPE_TYPE.Component;
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
    await LogicTopScope.dfsWalkTopScopeMap(this.scopeDepMap, cb);
  }
}
