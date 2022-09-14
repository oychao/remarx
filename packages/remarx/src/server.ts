import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as path from 'path';
import * as Router from '@koa/router';
import type { RemarxWebpackPlugin } from './main';
import { REMARX_NAME } from './constants';
import { REMARX_VIEW_HOME } from 'remarx-view';

export const createServer = async function startServer(
  plugin: RemarxWebpackPlugin
) {
  const STATIC_HOME = path.resolve(REMARX_VIEW_HOME(), 'dist');

  const app = new Koa();
  const router = new Router();

  router.get('/api/graph/module', async (ctx, next) => {
    ctx.body = JSON.stringify({
      config: plugin.config,
      depData: plugin.depData,
    });
    await next();
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.use(serve(STATIC_HOME));

  app.listen(plugin.config.port, () => {
    console.log(`${REMARX_NAME} server started`);
  });

  return app;
};
