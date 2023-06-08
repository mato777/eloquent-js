export type DBValue = string | number | Date | boolean;
export type Operation = '=' | '>=' | '<=' | 'like' | '<>' | '>' | '<';

export interface Condition {
  fieldName: string;
  value: DBValue;
  operation: string;
}

export interface OrderBy {
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
  protected _limit: number | undefined;
  protected _offset: number | undefined;
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
    const orderBy = this._orderBy.length > 0? ` ORDER BY ${this._orderByToString()}`: '';
    const limit = this._limit? ` LIMIT ${this._limit}` : '';
    const offset = this._offset? ` OFFSET ${this._offset}`: '';

    return `${query}${where}${orderBy}${limit}${offset}`;
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
  private _orderByToString() {
    if(this._orderBy.length > 0) {
      const orders = this._orderBy.map(item  => {
        return `${this._tableName}.${item.fieldName} ${item.direction}`;
      });
      return orders.join(', ');
    }

    return '';
  }

  public take(quantity: number): QueryBuilder {
    this._limit = quantity;
    return this;
  }

  public skip(skip: number): QueryBuilder {
    this._offset = skip;
    return this;
  }
}
