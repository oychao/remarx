import { ParserBase } from './parserBase';
import { Program } from './program';

export class DependencyGraph extends ParserBase {
  protected rootPath: string;
  private program: Program;

  constructor(rootPath: string) {
    super(rootPath);
    this.rootPath = rootPath;
    this.program = new Program(this.rootPath);
  }

  public async parse(): Promise<void> {
    await this.program.parse();
  }

  public async draw(): Promise<void> {}
}
