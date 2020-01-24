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
  public async getFileDepDag(): Promise<{ files: string[]; depRelations: [string, string][] }> {
    const files = new Set<string>();
    const depRelations: [string, string][] = [];

    const queue: Program[] = [this.program];
    let currProgram = queue.pop();

    while (currProgram) {
      files.add(currProgram.fullPath);
      await currProgram.forEachDepFile(async dep => {
        queue.push(dep);
      });

      await currProgram.forEachDepFile(async dep => {
        if (currProgram) {
          depRelations.push([currProgram.fullPath, dep.fullPath]);
        }
      });

      currProgram = queue.pop();
    }

    return {
      files: Array.from(files),
      depRelations,
    };
  }
}
