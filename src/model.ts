import pluralize from './plural-helper';
import QueryBuilder, { DBValue, Operation } from "./query-builder";

export default class Model {
  protected _tableName: string;
  protected _primaryKey = 'id';
  protected _queryBuilder: QueryBuilder;

  constructor(tableName?: string) {
    this._tableName = tableName ?? pluralize(2, this.constructor.name.toLowerCase());
    this._queryBuilder = new QueryBuilder(this._tableName);
  }

  public get primaryKey(): string {
    return this._primaryKey;
  }
  public get tableName(): string {
    return this._tableName;
  }

  // TODO: replace with its own interface args
  static where(...args: [string, Operation, DBValue] | [string, DBValue]): Model {
    const model = new this;
    model._queryBuilder.where(...args);
    return model;
  }

  public where(...args: [string, Operation, DBValue] | [string, DBValue]): Model {
    this._queryBuilder.where(...args);
    return this;
  }

  public getQueryBuilder(): QueryBuilder {
    return this._queryBuilder;
  }
}

