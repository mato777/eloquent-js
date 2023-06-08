import { DBClient } from '../src/connection';

describe('connection', () => {
  beforeAll(async () => {
    await DBClient.connect();
  });

  afterAll(async() => {
    await DBClient.end();
  });


  test('it works', async () => {

  });
});