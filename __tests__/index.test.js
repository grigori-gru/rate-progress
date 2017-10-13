import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import fs from 'fs';
import path from 'path';
// import faker from 'faker';

import app from '../src';
import parser from '../src/parser';

describe('requests', () => {
  let server;
  beforeAll(async () => {
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

  afterEach((done) => {
    server.close();
    done();
  });
});

describe('parser', () => {
  it('get data from HTML', async () => {
    const data = fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'test-rate.html'), 'utf8').toString();
    const res = parser(data).length;
    expect(res).toBe(100);
  });
});
