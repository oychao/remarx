import { LogicProgramCommon } from './logicProgramCommon';
import { VisitorReactDom } from '../visitor/visitorReactDom';

export class LogicProgramRoot extends LogicProgramCommon {
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
