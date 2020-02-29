import { ImplementedClass } from './implementedClass';
import { LogicProgramCommon } from './logicProgramCommon';
import { LogicNode } from './logicNode';
import { TopScopeDepend, TopScopeMap, LogicTopScope } from './logicTopScope';

export class LogicClass extends LogicNode {
  public name: string;

  public program: LogicProgramCommon;

  public scopeDepMap: TopScopeMap = {};

  constructor(astNode: ImplementedClass, program: LogicProgramCommon) {
    super(astNode);
    this.name = astNode.id.name;
    this.program = program;
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
