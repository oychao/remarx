export abstract class LogicProgramBase {
  protected fullPath: string;
  protected dirPath: string;
  protected filename: string;
  public abstract async parse(): Promise<void>;

  constructor(fullPath: string) {
    this.fullPath = fullPath;
    const parts = this.fullPath.split('/');
    this.filename = parts.pop() as string;
    this.dirPath = parts.join('/');
  }
}
