type DBValue = string | number | Date | boolean;
type Operation = '=' | '>=' | '<=' | 'like' | '<>' | '>' | '<';

interface Condition {
  fieldName: string;
  value: DBValue;
  operation: string;
}

interface OrderBy {
  fieldName: string;
  direction: 'ASC' | 'DESC';
}

export default class QueryBuilder {
  protected _tableName: string;
  protected _defaultField = '*';
  protected _columns: string[] = [];
  protected _fields = '';
  protected _driver;
  protected _filters: Condition[] = [];
  protected _orderBy: OrderBy[] = [];
  private validOperations = ['=', '>=', '<=', 'like', '<>', '>', '<'];

  constructor(tableName: string, driver = 'pg') {
    this._tableName = tableName;
    this._driver = driver;
  }

  public select(...fields: string[]): QueryBuilder {
    this._columns = this._columns.concat(fields);
    if (this._columns.length === 0) {
      this._columns = [this._defaultField];
    }
    this._fields = this._columns.map((field) => `${this._tableName}.${field}`).join(', ');
    return this;
  }

  public get columns() {
    return this._columns;
  }

  public get fields() {
    return this._fields;
  }

  public toSql(): string {
    if (this._columns.length === 0) {
      this.select();
    }
    let query = `SELECT ${this.fields}` + ` FROM ${this._tableName}`;
    let filters: string[] = [];
    if (this._filters.length > 0) {
      filters = this._filters.map((filter) => {
        return `${this._tableName}.${filter.fieldName} ${filter.operation} ${this._quoteValue(filter.value)}`;
      });
    }

    const where = this._filters.length > 0 ? ` WHERE ${filters.join(' AND ')}` : '';

    return `${query}${where}`;
  }

  private _quoteValue(value: DBValue): DBValue {
    if (typeof value === 'number') {
      return value;
    }

    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }

    return `'${value}'`;
  }

  public where(...args: [string, Operation, DBValue] | [string, DBValue]) {
    if (args.length < 2) {
      throw new Error('Missing parameters in query.');
    }

    if (args.length > 3) {
      throw new Error('Invalid parameters in query.');
    }

    if (args.length === 2) {
      this._filters.push({ fieldName: args[0], value: args[1], operation: '=' });
    }

    if (args.length === 3) {
      if (!this.validOperations.includes(args[1])) {
        throw new Error(`Operation is not valid.  Included ${args[1]}`);
      }
      this._filters.push({ fieldName: args[0], value: args[2], operation: args[1] });
    }

    return this;
  }

  orderBy(field: string, direction?: 'ASC' | 'DESC'): QueryBuilder {
    this._orderBy.push({fieldName: field, direction: direction?? 'ASC'});

    return this;
  }
}
