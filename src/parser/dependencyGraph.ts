import { ProgramBase } from './programBase';
import { ProgramRoot } from './programRoot';
import { Program } from './program';

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

  /**
   * output file dependency dag
   */
  public async drawFileDepDag(): Promise<void> {
    const queue: Program[] = [this.program];
    let currProgram = queue.pop();
    while (currProgram) {
      await currProgram.forEachDepFile(async dep => {
        queue.push(dep);
      });

      await currProgram.forEachDepFile(async dep => {
        if (currProgram) {
          console.log(`${currProgram.fullPath} depends on ${dep.fullPath}`);
        }
      });

      currProgram = queue.pop();
    }
  }
}
