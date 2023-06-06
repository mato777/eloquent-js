import { DBClient } from '../src/connection';
import QueryBuilder from "../src/query-builder";

describe('connection', () => {
  beforeAll(async () => {
    await DBClient.connect();
  });

  afterAll(async() => {
    await DBClient.end();
  });


  test('it works', async () => {

    const queryBuilder = new QueryBuilder('accounts');
    const result = await DBClient.query(queryBuilder.where('id', '>=', 5).toSql());

    expect(result).not.toBeUndefined();
  });
});