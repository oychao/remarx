import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  JSXIdentifier,
  JSXMemberExpression,
  MemberExpression,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';

import { startWithCapitalLetter } from '../utils';
import { LogicAbstractDepNode, TopScopeDepend, TopScopeMap } from '../parser/compDeps/logicAbstractDepNode';
import { LogicProgramCommon } from '../parser/programs/logicProgramCommon';
import { DepPlugin, selector } from './depPlugin';
import { ImportScopeProvider } from './importScopeProvider';
import { LocalScopeProvider } from './localScopeProvider';

export class ComponentDepPlugin extends DepPlugin {
  private currWorkingScope: LogicAbstractDepNode | undefined;

  constructor(program: LogicProgramCommon) {
    super(program);
  }

  /**
   * handler patterns:
   * const foo = () => {};
   * const foo = function () {};
   * function foo () {}
   */
  @selector('f_dton > blk')
  @selector('v_dtor > f_exp > blk')
  @selector('v_dtor > af_exp > blk')
  protected async scanLocalScope(
    path: any[],
    node: BlockStatement,
    parent: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
    grantParent: any
  ): Promise<void> {
    for (let i = 0, len = path.length - 1; i < len; i++) {
      const astAncestor = path[i];
      // it's not a top block scope
      if (astAncestor.type === AST_NODE_TYPES.BlockStatement) {
        return;
      }
    }

    // like `const foo = () => {};` or `const foo = function () {};`
    const isVariableDeclaration =
      parent.type === AST_NODE_TYPES.ArrowFunctionExpression || parent.type === AST_NODE_TYPES.FunctionExpression;

    // like `function foo () {}`
    const isFunctionDeclaration = parent.type === AST_NODE_TYPES.FunctionDeclaration;

    let functionName = '';
    if (isFunctionDeclaration) {
      functionName = parent?.id?.name as string;
    } else if (isVariableDeclaration) {
      functionName = grantParent?.id?.name as string;
    }

    if (
      (startWithCapitalLetter(functionName) || functionName.slice(0, 3) === 'use') &&
      this.program.getPluginInstance(LocalScopeProvider).localScopes[functionName] instanceof LogicAbstractDepNode
    ) {
      this.currWorkingScope = this.program.getPluginInstance(LocalScopeProvider).localScopes[
        functionName
      ] as LogicAbstractDepNode;
    }
  }

  /**
   * handle pattern:
   * useFoo();
   * Foo.useFoo();
   */
  @selector('cl')
  protected async visitPath7(path: any[], node: CallExpression): Promise<void> {
    const nodes: MemberExpression[] = [];
    let currCallee = node.callee as MemberExpression | Identifier;
    while (AST_NODE_TYPES.MemberExpression === currCallee.type) {
      nodes.push(currCallee);
      currCallee = currCallee.object as MemberExpression | Identifier;
    }
    const parent = nodes.pop();

    if (this.currWorkingScope) {
      if (parent) {
        const callerName: string = (parent.object as Identifier).name as string;
        const scopeName: string = (parent.property as Identifier).name as string;
        if (scopeName.slice(0, 3) === 'use') {
          const targetProgram: TopScopeDepend = this.program.getPluginInstance(ImportScopeProvider).imports[
            callerName
          ] as TopScopeDepend;
          this.currWorkingScope.scopeDepMap[scopeName] =
            typeof targetProgram === 'object'
              ? (this.program.getPluginInstance(ImportScopeProvider).imports[callerName] as TopScopeMap)[scopeName]
              : `${targetProgram}#${scopeName}`;
        }
      } else {
        const scopeName: string = currCallee.name as string;
        if (scopeName.slice(0, 3) === 'use') {
          this.currWorkingScope.scopeDepMap[scopeName] = this.program.getPluginInstance(ImportScopeProvider).imports[
            scopeName
          ];
        }
      }
    }
  }

  /**
   * handle pattern:
   * <MyComp />
   */
  @selector('jsx_ele > jsx_o_ele > jsx_idt')
  protected async visitPath8(path: any[], node: JSXIdentifier): Promise<void> {
    const scopeName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(scopeName)) {
      this.currWorkingScope.scopeDepMap[scopeName] = this.program.getPluginInstance(ImportScopeProvider).imports[
        scopeName
      ];
    }
  }

  /**
   * handle pattern:
   * <Common.MyComp />
   */
  @selector('jsx_ele > jsx_o_ele > jsx_mem_exp > jsx_idt')
  protected async visitPath9(path: any[], node: JSXIdentifier, parent: JSXMemberExpression): Promise<void> {
    if (node === parent.object) {
      return;
    }
    const scopeName: string = node.name as string;
    if (this.currWorkingScope && startWithCapitalLetter(scopeName)) {
      this.currWorkingScope.scopeDepMap[scopeName] = this.program.getPluginInstance(ImportScopeProvider).imports[
        scopeName
      ];
    }
  }
}
