import Model from 'model';

enum RelationshipType {
  HAS_ONE = 'HAS_ONE',
}

interface Relationship {
  parentModel: Model;
  parentName: string;
  tableName: string;
  model: Model;
  type: RelationshipType;
  foreignKey: string;
  localKey: string;
}

export default class Relation {
  protected relations: Relationship[] = [];

  public hasOne(parentModel: Model, parentName: string, model: Model, foreignKey?: string, localKey?: string) {
    const relation = this.findRelation(model.tableName);

    if(!relation) {
      this.relations.push({
        parentModel,
        parentName,
        tableName: model.tableName,
        model,
        type: RelationshipType.HAS_ONE,
        foreignKey: foreignKey ?? `${model.tableName}_id`,
        localKey: localKey ?? 'id',
      });
    }

    return model;
  }

  public findRelation(relationName: string) {
    const relation = this.relations.find(relation => relation.tableName === relationName);

    if(relation) return relation;

    throw new Error(`Relation ${relationName} not found`)
  }
}
