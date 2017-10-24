import 'babel-polyfill';

import bodyParser from 'koa-bodyparser';
import middleware from 'koa-webpack';
import Koa from 'koa';
import path from 'path';
import dotenv from 'dotenv';
import Router from 'koa-router';
import Pug from 'koa-pug';
import methodOverride from 'koa-methodoverride';
import koaLogger from 'koa-logger';
import _ from 'lodash';
import schedule from 'node-schedule';

import getWebpackConfig from '../webpack.config.babel';
import getRoutes from './controllers';
import hexletRequest from './lib/hexlet-request';

dotenv.config();

export default () => {
  const app = new Koa();

  app.use(bodyParser());
  app.use(methodOverride((req) => {
    // return req?.body?._method;
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method; // eslint-disable-line
    }
    return null;
  }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(middleware({
      config: getWebpackConfig(),
    }));
  }

  app.use(koaLogger());
  const router = new Router();

  const pug = new Pug({
    viewPath: path.join(__dirname, './views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });

  pug.use(app);

  app.use(router.routes()).use(router.allowedMethods());
  schedule.scheduleJob('30 * * * * *', async () => {
    await hexletRequest('https://ru.hexlet.io/ratings', new Date().toString());
  });

  getRoutes(router);

  return app;
};
