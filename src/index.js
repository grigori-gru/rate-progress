import 'babel-polyfill';

import bodyParser from 'koa-bodyparser';
import middleware from 'koa-webpack';
import Koa from 'koa';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Router from 'koa-router';
import Pug from 'koa-pug';
import methodOverride from 'koa-methodoverride';
import koaLogger from 'koa-logger';
import _ from 'lodash';

import getWebpackConfig from '../webpack.config.babel';
import HTMLparser from './parser';

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
  router.get('root', '/', async (ctx) => {
    const pathToHTML = path.resolve(__dirname, '..', '__tests__', '__fixtures__', 'test-rate.html');
    const data = fs.readFileSync(pathToHTML, 'utf8').toString();
    const users = HTMLparser(data);
    await ctx.render('index', { users });
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
