const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const CarModel = require('../../src/models/car')
const User = require('../../src/models/user')
const Brand = require('../../src/models/brand')
const Auction = require('../../src/models/auction')

describe('Car', () => {
  const Car = CarModel(sequelize, dataTypes)
  const car = new Car()

  checkModelName(Car)('Car')

  describe('properties', () => {
    ['name', 'description', 'year', 'chassis'].forEach(
      checkPropertyExists(car)
    )
  })

  describe('associations', () => {
    beforeEach(() => {
      Car.associate({ User, Brand, Auction })
    })

    it('defined a belongsTo association with User model', () => {
      expect(Car.belongsTo).toHaveBeenCalledWith(User, { as: 'owner', foreignKey: 'owner_id' })
    })

    it('defined a belongsTo association with Brand model', () => {
      expect(Car.belongsTo).toHaveBeenCalledWith(Brand, { as: 'brand', foreignKey: 'brand_id' })
    })

    it('defined a hasMany association with Auction model', () => {
      expect(Car.hasMany).toHaveBeenCalledWith(Auction, { as: 'auctions', foreignKey: 'car_id' })
    })
  })
})
