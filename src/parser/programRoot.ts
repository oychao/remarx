import { Program } from './program';
import { VisitorReactDom } from './visitor/visitorReactDom';

export class ProgramRoot extends Program {
  private visitorReactDom: VisitorReactDom = new VisitorReactDom(this);

  constructor(fullPath: string) {
    super(fullPath);
  }

  public async parse(): Promise<void> {
    await super.parse();
    await this.rootAst?.accept(this.visitorReactDom);
    // console.log(Array.from(this.visitorReactDom.compTagNames));
  }
}
