import Model from '../src/Model';

describe('Model', () => {
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

    class Plane extends Model {}

    test('custom primary key name', () => {
      const flight = new Flight();

      expect(flight.primaryKey).toEqual('flight_id');
    });

    test('default primary key', () => {
      const plane = new Plane();
      expect(plane.primaryKey).toEqual('id');
    });
  });
});
