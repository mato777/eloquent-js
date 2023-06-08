import QueryBuilder from "../src/query-builder";

describe('QueryBuilder', () => {
  let queryBuilder: QueryBuilder;
  beforeEach(() => {
    queryBuilder = new QueryBuilder('tests');
  });

  describe('select',  () => {
    test('select with one fields must return same field with quotes', () => {
      queryBuilder.select('my_column');

      expect(queryBuilder.fields).toEqual("tests.my_column");
    });

    test('empty select should return *', () => {
      queryBuilder.select();
      expect(queryBuilder.fields).toEqual("tests.*");
    });

    test('select with multiple fields should return one string each field between quotes and separated by comma', () => {
      queryBuilder.select('a', 'b', 'c');
      expect(queryBuilder.fields).toEqual("tests.a, tests.b, tests.c");
    });

    test('should concatenate several calls to select', () => {
      queryBuilder.select('a').select('b');
      expect(queryBuilder.fields).toEqual("tests.a, tests.b");
    });
  });

  describe('toSql', () => {
    test('should return select all from tablename if no column was provided', () => {
      const sqlQuery = queryBuilder.toSql();
      expect(sqlQuery).toEqual("SELECT tests.* FROM tests");
    });

    test('should return select column name from tablename if a column was provided', () => {
      const sqlQuery = queryBuilder.select('abc').toSql();
      expect(sqlQuery).toEqual("SELECT tests.abc FROM tests");
    });

    test('should return select column name from tablename if a column was provided', () => {
      const sqlQuery = queryBuilder.select('abc').toSql();
      expect(sqlQuery).toEqual("SELECT tests.abc FROM tests");
    });

    test('should return no values if no where was called ', () => {
      const sqlQuery = queryBuilder.toSql();
      expect(sqlQuery).toEqual("SELECT tests.* FROM tests");
    });
  });

  describe('where only one column + value', () => {
    test('should return filters when called with string value', () => {
      const sqlQuery = queryBuilder.where('my_column', 'my_value');
      expect(queryBuilder.toSql()).toEqual(`SELECT tests.* FROM tests WHERE tests.my_column = 'my_value'`);
    });

    test('should return filters when called with number value', () => {
      const sqlQuery = queryBuilder.where('my_column', 1);
      expect(queryBuilder.toSql()).toEqual(`SELECT tests.* FROM tests WHERE tests.my_column = 1`);
    });

    test('should return filters when called with date value', () => {
      const date = new Date();
      const sqlQuery = queryBuilder.where('my_column', date);
      expect(queryBuilder.toSql()).toEqual(`SELECT tests.* FROM tests WHERE tests.my_column = '${date.toISOString()}'`);
    });
  });

  describe('where one column + one value + one operation', () => {
    test('should return filters when called with string value', () => {
      const sqlQuery = queryBuilder.where('my_column', '>=', 'my_value');
      expect(queryBuilder.toSql()).toEqual(`SELECT tests.* FROM tests WHERE tests.my_column >= 'my_value'`);
    });

    test('should return filters when called with number value', () => {
      const sqlQuery = queryBuilder.where('my_column', 1);
      expect(queryBuilder.toSql()).toEqual(`SELECT tests.* FROM tests WHERE tests.my_column = 1`);
    });

    test('should return filters when called with date value', () => {
      const date = new Date();
      const sqlQuery = queryBuilder.where('my_column', date);
      expect(queryBuilder.toSql()).toEqual(`SELECT tests.* FROM tests WHERE tests.my_column = '${date.toISOString()}'`);
    });
  });

  describe('order by', () => {
    test('should return order by in the query with ASC direction if not provided', () => {
      const query = queryBuilder.orderBy('my_column').toSql();
      expect(query).toEqual('SELECT tests.* FROM tests ORDER BY tests.my_column ASC');
    });

    test('should return order by in the query with proper direction if provided', () => {
      const query = queryBuilder.orderBy('my_column', 'ASC').toSql();
      expect(query).toEqual('SELECT tests.* FROM tests ORDER BY tests.my_column ASC');
    });

    test('should return order by in the query with proper direction if provided', () => {
      const query = queryBuilder.orderBy('my_column', 'DESC').toSql();
      expect(query).toEqual('SELECT tests.* FROM tests ORDER BY tests.my_column DESC');
    });
  });
});
