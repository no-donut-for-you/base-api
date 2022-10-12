const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const BrandModel = require('../../src/models/brand')
const Car = require('../../src/models/car')

describe('Brand', () => {
  const Brand = BrandModel(sequelize, dataTypes)
  const brand = new Brand()

  checkModelName(Brand)('Brand')

  describe('properties', () => {
    ['name', 'description'].forEach(
      checkPropertyExists(brand)
    )
  })

  describe('associations', () => {
    beforeEach(() => {
      Brand.associate({ Car })
    })

    it('defined a hasMany association with Car model', () => {
      expect(Brand.hasMany).toHaveBeenCalledWith(Car, { as: 'cars', foreignKey: 'brand_id' })
    })
  })
})
