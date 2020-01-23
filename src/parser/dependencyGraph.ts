import { ProgramBase } from './programBase';
import { Program } from './program';

export class DependencyGraph extends ProgramBase {
  protected fullPath: string;
  private program: Program;

  constructor(fullPath: string) {
    super(fullPath);
    this.fullPath = fullPath;
    this.program = new Program(this.fullPath);
  }

  public async parse(): Promise<void> {
    await this.program.parse();
  }

  public async draw(): Promise<void> {}
}
