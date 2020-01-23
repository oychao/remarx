export abstract class ParserBase {
  protected rootPath: string;
  protected dirPath: string;
  protected filename: string;
  public abstract async parse(): Promise<void>;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    const parts = this.rootPath.split('/');
    this.filename = parts.pop() as string;
    this.dirPath = parts.join('/');
  }
}
