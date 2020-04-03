import { ReactDomPlugin } from '../../plugin/reactDomPlugin';
import { LogicProgramCommon } from './logicProgramCommon';

export class LogicProgramEntrance extends LogicProgramCommon {
  public selectorReactDom: ReactDomPlugin = new ReactDomPlugin(this);

  protected readonly isEntrance: boolean = true;

  constructor(fullPath: string) {
    super(fullPath);
  }

  public async parse(): Promise<void> {
    await super.parse();
    await this.astNode?.accept(this.selectorReactDom);
  }
}
