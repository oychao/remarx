import { ImplementedClass } from './implementedClass';
import { LogicProgramCommon } from './logicProgramCommon';
import { TopScopeDepend, TopScopeMap, LogicAbstractDepNode } from './logicAbstractDepNode';

export class LogicClassComponent extends LogicAbstractDepNode {
  public name: string;

  public program: LogicProgramCommon;

  constructor(astNode: ImplementedClass, program: LogicProgramCommon) {
    super(astNode.id.name, astNode, program);
    this.name = astNode.id.name;
    this.program = program;
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
