import { REMARX_NAME } from './constants';
import { Compiler } from 'webpack';
import * as http from 'http';

export class RemarxWebpackPlugin {
  private depData: Record<string, any> = {};

  private server: http.Server = null;

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(REMARX_NAME, stats => {
      this.depData = Array.from(stats.compilation.modules)
        .map(mod => {
          // return mod;
          return {
            filePath: mod.identifier(),
            depPaths: mod.dependencies
              .map(dep => {
                const depMod = stats.compilation.moduleGraph.getModule(dep);
                return depMod && (depMod as any).resource;
              })
              .filter(depPath => !!depPath),
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

  html(strings: TemplateStringsArray, ...values: Array<any>) {
    return strings
      .map((string, index) => `${string}${values[index] || ''}`)
      .join('');
  }

  renderViewer({
    title,
    depData,
  }: {
    title: string;
    depData: Record<string, any>;
  }) {
    return this.html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body>
          <div>
            <pre>${JSON.stringify(depData, null, 2)}</pre>
          </div>
        </body>
      </html>`;
  }

  async startServer() {
    if (this.server) {
      return;
    }

    this.server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/') {
        const html = this.renderViewer({
          title: REMARX_NAME,
          depData: this.depData,
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      }
    });

    await new Promise(resolve => {
      this.server.listen(15217, '127.0.0.1', () => {
        console.log(`${REMARX_NAME} server started`);
        resolve(undefined);
      });
    });
  }
}
