import Model from '../src/Model';

describe('Model', () => {
  class Plane extends Model {}

  describe('tableName', () => {
    class Car extends Model {
    }

    test('should return with the name of class in lowercase and in plural if no tableName is provided', () => {
      const car = new Car();
      expect(car.tableName).toEqual('cars');
    });

    test('should return name if tableName was provided', () => {
      const car = new Car('cars_motorbikes');
      expect(car.tableName).toEqual('cars_motorbikes');
    });

    // TODO: convert camelcase to _
  });

  describe('primaryKey', () => {
    class Flight extends Model {
      protected _primaryKey = 'flight_id';
    }


    test('custom primary key name', () => {
      const flight = new Flight();

      expect(flight.primaryKey).toEqual('flight_id');
    });

    test('default primary key', () => {
      const plane = new Plane();
      expect(plane.primaryKey).toEqual('id');
    });
  });


  describe('static where', () => {
    test('should return a model', () => {
      const planeModel = Plane.where('my_column', 'my_value');
      expect(planeModel.tableName).toEqual('planes');
    });

    test('should return a model and filter already set', () => {
      const planeModel = Plane.where('my_column', 'my_value');
      expect(planeModel.getQueryBuilder().toSql()).toEqual(`SELECT planes.* FROM planes WHERE planes.my_column = 'my_value'`);
    });

    test('should return a model and filter already set', () => {
      const planeModel = Plane.where('my_column', 'my_value').where('my_column2', 'my_value2');
      expect(planeModel.getQueryBuilder().toSql()).toEqual(`SELECT planes.* FROM planes WHERE planes.my_column = 'my_value' AND planes.my_column2 = 'my_value2'`);
    });
  });
});
