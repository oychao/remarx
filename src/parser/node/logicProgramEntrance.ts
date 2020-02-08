import { SelectorReactDom } from '../selector/selectorReactDom';
import { LogicProgramCommon } from './logicProgramCommon';

export class LogicProgramEntrance extends LogicProgramCommon {
  public selectorReactDom: SelectorReactDom = new SelectorReactDom(this);

  constructor(fullPath: string) {
    super(fullPath);
  }

  public async parse(): Promise<void> {
    await super.parse();
    await this.astNode?.accept(this.selectorReactDom);
    // console.log(Array.from(this.selectorReactDom.compTagNames));
  }
}
