import request from 'supertest';
import matchers from 'jest-supertest-matchers';
// import faker from 'faker';

import app from '../src';

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
