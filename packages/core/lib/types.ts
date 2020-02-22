export interface Config {
  rootDir: string;
  sourceFolder: string;
  entranceFile: string;
  debug?: {
    on: boolean;
    output: string;
    rootDir: string;
  };
}
