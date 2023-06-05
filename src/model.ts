import pluralize from './plural-helper';

export default class Model {
  protected _tableName: string;
  protected _primaryKey = 'id';
  constructor(tableName?: string) {
    this._tableName = tableName ?? pluralize(2, this.constructor.name.toLowerCase());
  }

  public get primaryKey(): string {
    return this._primaryKey;
  }
  public get tableName(): string {
    return this._tableName;
  }
}

