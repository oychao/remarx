import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as path from 'path';
import * as Router from '@koa/router';
import type { RemarxWebpackPlugin } from './main';
import { REMARX_NAME } from './constants';

const STATIC_HOME = path.resolve(
  __dirname,
  '..',
  'node_modules/remarx-view/dist'
);

export const createServer = function startServer(plugin: RemarxWebpackPlugin) {
  const app = new Koa();
  const router = new Router();

  router.get('/api/graph/module', async (ctx, next) => {
    ctx.body = JSON.stringify(plugin.depData);
    await next();
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.use(serve(STATIC_HOME));

  app.listen(plugin.config.port, () => {
    console.log(`${REMARX_NAME} server started`);
  });

  return app;
};
