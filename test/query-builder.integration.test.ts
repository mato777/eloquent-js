import QueryBuilder from "../src/query-builder";

describe('Query builder integration', () => {
  let queryBuilder: QueryBuilder;
  beforeEach(() => {
    queryBuilder = new QueryBuilder('tests');
  })
  test('select + where', () => {
    const expectedQuery = "SELECT tests.abc FROM tests WHERE tests.my_column = 'my_value'";
    const query = queryBuilder.select('abc').where('my_column', 'my_value').toSql();
    expect(query).toEqual(expectedQuery);
  });
  test('select + where inverted order', () => {
    const expectedQuery = "SELECT tests.abc FROM tests WHERE tests.my_column = 'my_value'";
    const query = queryBuilder.where('my_column', 'my_value').select('abc').toSql();
    expect(query).toEqual(expectedQuery);
  });

  test('select + where + orderBy', () => {
    const expectedQuery = "SELECT tests.abc FROM tests WHERE tests.my_column = 'my_value' ORDER BY tests.my_other_column DESC";
    const query = queryBuilder.select('abc').where('my_column', 'my_value').orderBy('my_other_column', 'DESC').toSql();
    expect(query).toEqual(expectedQuery);
  });

  test('select + where + orderBy + limit', () => {
    const expectedQuery = "SELECT tests.abc FROM tests WHERE tests.my_column = 'my_value' ORDER BY tests.my_other_column DESC LIMIT 10";
    const query = queryBuilder.select('abc').where('my_column', 'my_value').orderBy('my_other_column', 'DESC').take(10).toSql();
    expect(query).toEqual(expectedQuery);
  });

  test('select + where + orderBy + limit + offset', () => {
    const expectedQuery = "SELECT tests.abc FROM tests WHERE tests.my_column = 'my_value' ORDER BY tests.my_other_column DESC LIMIT 10 OFFSET 100";
    const query = queryBuilder.select('abc')
      .where('my_column', 'my_value')
      .orderBy('my_other_column', 'DESC')
      .take(10)
      .skip(100).toSql();
    expect(query).toEqual(expectedQuery);
  });
});
