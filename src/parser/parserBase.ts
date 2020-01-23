export abstract class ParserBase {
  protected rootPath: string = '';
  public abstract async parse(): Promise<void>;
}
