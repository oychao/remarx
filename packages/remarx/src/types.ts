export interface FileRule {
  nameMatch?: RegExp | string;
  fileType: string;
}

export interface RemarxConfig {
  fileRules: Array<FileRule>;
  port?: number;
}
