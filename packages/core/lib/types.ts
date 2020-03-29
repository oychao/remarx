export enum HofAction {
  IGNORE = 'ignore',
}

export interface Config {
  rootDir: string;
  sourceFolder: string;
  entranceFile: string;
  debug?: {
    on: boolean;
    output: string;
    rootDir: string;
  };
  alias?: {
    [key: string]: string;
  };
  hof?: Array<{
    module?: string;
    name: string;
    action: HofAction;
  }>;
}
