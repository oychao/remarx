import {
  CallExpression,
  ExportNamedDeclaration,
  ImportDeclaration,
  Literal,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { ExtendedNode } from '../parser/astNodes/extendedNode';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { DepPlugin } from './depPlugin';
import { selector } from './depPlugin';

export class DepFilePlugin extends DepPlugin {
  public static readonly POSSIBLE_FILE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  /**
   * handle pattern:
   * import Foo from './foo';
   * import { Foo } from './foo';
   * import * as Foo from './foo';
   */
  @selector('p > imp_dton')
  protected async importHandler(path: ExtendedNode[], node: ImportDeclaration): Promise<void> {
    if (node?.source?.value) {
      await this.asyncImportLiteralSource(node.source.value as string);
    }
  }

  /**
   * handle pattern:
   * export { default } from './xxx';
   * export * from './xxx';
   */
  @selector('p > exp_a_dton > lit')
  @selector('exp_n_dton > lit')
  protected async exportHandler(path: ExtendedNode[], node: Literal, parent: ExportNamedDeclaration): Promise<void> {
    if (node.value) {
      await this.asyncImportLiteralSource(node.value as string);
    }
  }

  /**
   * handle pattern:
   * import('foo');
   */
  @selector('cl > imp')
  protected async asyncImportHandler(path: ExtendedNode[], node: Literal, parent: CallExpression): Promise<void> {
    if ((parent?.arguments[0] as Literal)?.value) {
      await this.asyncImportLiteralSource((parent?.arguments[0] as Literal)?.value as string);
    }
  }
}
