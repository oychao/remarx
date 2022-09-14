import * as Koa from 'koa';
import { Compiler } from 'webpack';
import { REMARX_NAME } from './constants';
import { RemarxConfig } from './types';
import { createServer } from './server';

export class RemarxWebpackPlugin {
  private server: Koa<Koa.DefaultState, Koa.DefaultContext> = null;

  public depData: Record<string, any> = {};

  public config: RemarxConfig = {
    fileRules: [
      {
        nameMatch: /((store|model)\.tsx?)$/i,
        fileType: 'store',
      },
      {
        nameMatch: /((use[a-zA-Z0-9]{1,}|hooks?)\.tsx?)$/i,
        fileType: 'hook',
      },
      {
        fileType: 'else',
      },
    ],
    port: 5217,
  };

  constructor(config: RemarxConfig) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.config.fileRules.forEach(rule => {
      if (rule.nameMatch && rule.nameMatch instanceof RegExp) {
        rule.nameMatch = rule.nameMatch.toString();
      }
    });
  }

  public apply(compiler: Compiler) {
    compiler.hooks.done.tap(REMARX_NAME, stats => {
      this.depData = Array.from(stats.compilation.modules)
        .map(mod => {
          // return mod;
          const identifier = mod.identifier().split('!').pop();
          return {
            filePath: identifier,
            depPaths: Array.from(
              new Set(
                mod.dependencies
                  .map(dep => {
                    const depMod = stats.compilation.moduleGraph.getModule(dep);
                    return depMod && (depMod as any).resource;
                  })
                  .filter(
                    (depPath: string) =>
                      !!depPath && !depPath.includes('node_modules')
                  )
              )
            ),
          };
        })
        .filter(
          dep =>
            !dep.filePath.includes('node_modules') &&
            !dep.filePath.includes('webpack/runtime')
        );
      this.startServer();
    });
  }

  private async startServer() {
    if (this.server) {
      return;
    }

    try {
      this.server = await createServer(this);
    } catch (error) {
      console.log('port already in use');
    }
  }
}
