import { ProgramBase } from './programBase';
import { ProgramRoot } from './programRoot';

export class DependencyGraph extends ProgramBase {
  protected fullPath: string;
  private program: ProgramRoot;

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
    this.program = new ProgramRoot(this.fullPath);
  }

  public async parse(): Promise<void> {
    await this.program.parse();
  }

  public async draw(): Promise<void> {}
}
