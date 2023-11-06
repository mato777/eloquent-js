import QueryBuilder from "../src/query-builder";

describe('Relations', () => {
  let queryBuilder: QueryBuilder;
  beforeEach(() => {
    queryBuilder = new QueryBuilder('users');
  });

  describe('join',  () => {
    test('inner join', () => {
      const query = queryBuilder.select().join('posts', 'users.id', '=', 'posts.user_id').toSql();

      expect(query).toEqual(`SELECT * FROM users JOIN posts ON users.id = posts.user_id`);
    });
  });
});
