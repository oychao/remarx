import { LogicNode } from './logicNode';

export abstract class LogicProgramBase extends LogicNode {
  protected fullPath: string;
  protected dirPath: string;
  protected filename: string;
  public abstract async parse(): Promise<void>;

  constructor(fullPath: string) {
    super();

    this.fullPath = fullPath;
    const parts = this.fullPath.split('/');
    this.filename = parts.pop() as string;
    this.dirPath = parts.join('/');
  }
}
