import { VisitorReactDom } from '../visitor/visitorReactDom';
import { LogicProgramCommon } from './logicProgramCommon';

export class LogicProgramEntrance extends LogicProgramCommon {
  public visitorReactDom: VisitorReactDom = new VisitorReactDom(this);

  constructor(fullPath: string) {
    super(fullPath);
  }

  public async parse(): Promise<void> {
    await super.parse();
    await this.astNode?.accept(this.visitorReactDom);
    // console.log(Array.from(this.visitorReactDom.compTagNames));
  }
}
