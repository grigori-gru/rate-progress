import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import fs from 'fs';
import path from 'path';
import nock from 'nock';
import querystring from 'querystring';

import app from '../src';
import parser from '../src/lib/parser';
import hexletRequest from '../src/lib/hexlet-request';
import models from '../src/models';

describe('requests', async () => {
  let server;
  beforeAll(async () => {
    await models.User.sync({ force: true });
    await models.PrevUser.sync({ force: true });
    jasmine.addMatchers(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET /', async () => {
    const res = await request(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET error', async () => {
    const res = await request(server)
      .get('/error');
    expect(res).toHaveHTTPStatus(404);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});

describe('nock requests', async () => {
  let server;
  const testPath = './__tests__/__fixtures__';
  const htmlBefore = path.resolve(testPath, 'before.html');
  const htmlAfter = path.resolve(testPath, 'after.html');
  const expected = path.resolve(testPath, 'expected.html');
  const expected2 = path.resolve(testPath, 'expected2.html');

  const dataBefore = fs.readFileSync(htmlBefore, 'utf8');
  const dataAfter = fs.readFileSync(htmlAfter, 'utf8');
  const expectedData = fs.readFileSync(expected, 'utf8');
  const expectedData2 = fs.readFileSync(expected2, 'utf8');

  const date = new Date().toString();
  const query = querystring.stringify({ date });

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await models.User.sync({ force: true });
    await models.PrevUser.sync({ force: true });
  });

  beforeEach(() => {
    server = app().listen();
    nock('http://ru.hexlet.io')
      .get('/ratingsbefore/')
      .reply(200, dataBefore)
      .get('/ratingsafter/')
      .reply(200, dataAfter);
  });

  it('test load second time', async () => {
    await hexletRequest('http://ru.hexlet.io/ratingsbefore/', date);
    const res1 = await request(server).get('/');
    expect(parser(res1.text)).toEqual(parser(expectedData));

    await hexletRequest('http://ru.hexlet.io/ratingsafter/', new Date().toString());
    const res = await request(server).get(`/?${query}`);
    expect(parser(res.text)).toEqual(parser(expectedData2));
  });

  afterEach((done) => {
    server.close();
    done();
  });
});

describe('parser', () => {
  it('get data from HTML', async () => {
    const data = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'before.html'), 'utf8').toString();
    const res = parser(data).length;
    expect(res).toBe(10);
  });
});
