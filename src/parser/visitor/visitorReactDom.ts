import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { JSXIdentifier, JSXMemberExpression } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { startWithCapitalLetter } from '../../utils';
import { ScopeNodeMap } from '../node/logicTopScope';
import { LogicProgram } from '../node/logicProgram';
import { Visitor, SelectorHandlerMap } from './visitor';

export class VisitorReactDom extends Visitor {
  protected selectorHandlerMap: SelectorHandlerMap[] = [];

  public compDepMap: ScopeNodeMap = {};

  constructor(program: LogicProgram) {
    super(program);
    this.selectorHandlerMap = [
      {
        selector: [AST_NODE_TYPES.JSXElement, AST_NODE_TYPES.JSXOpeningElement, AST_NODE_TYPES.JSXIdentifier],
        handler: this.handleJJJPath,
      },
      {
        selector: [
          AST_NODE_TYPES.JSXElement,
          AST_NODE_TYPES.JSXOpeningElement,
          AST_NODE_TYPES.JSXMemberExpression,
          AST_NODE_TYPES.JSXIdentifier,
        ],
        handler: this.handleJJJJPath,
      },
    ];
  }

  private async handleJJJPath(path: any[], node: JSXIdentifier): Promise<void> {
    const compName: string = node.name as string;
    if (startWithCapitalLetter(compName)) {
      this.compDepMap[compName] = this.program.visitorFileDependency.identifierDepMap[
        compName
      ]?.visitorFileDependency.exports[compName];

      // TODO read dependencies from local scopes first, then imports instead of exports
      console.log(this.program.visitorFileDependency.identifierDepMap[compName]?.visitorFileDependency);
    }
  }

  private async handleJJJJPath(path: any[], node: JSXIdentifier, parent: JSXMemberExpression): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const compName: string = node.name as string;
    if (startWithCapitalLetter(compName)) {
      this.compDepMap[compName] = this.program.visitorFileDependency.identifierDepMap[
        (parent.object as JSXIdentifier)?.name as string
      ]?.visitorFileDependency.exports[compName];
    }
  }
}
