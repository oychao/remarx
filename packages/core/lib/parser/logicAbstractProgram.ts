import { LogicAbstractNode } from './logicAbstractNode';

export abstract class LogicAbstractProgram extends LogicAbstractNode {
  public abstract async parse(): Promise<void>;

  public dirPath: string;

  protected fullPath: string;

  protected filename: string;

  constructor(fullPath: string) {
    super();

    this.fullPath = fullPath;
    const parts = this.fullPath.split('/');
    this.filename = parts.pop() as string;
    this.dirPath = parts.join('/');
  }
}
