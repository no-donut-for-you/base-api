const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const UserModel = require('../../src/models/user')
const Car = require('../../src/models/car')
const Bid = require('../../src/models/bid')

describe('User', () => {
  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  describe('properties', () => {
    ['name', 'email'].forEach(
      checkPropertyExists(user)
    )
  })

  describe('associations', () => {
    beforeEach(() => {
      User.associate({ Car, Bid })
    })

    it('defined a hasMany association with Bid model', () => {
      expect(User.hasMany).toHaveBeenCalledWith(Bid, { as: 'bids', foreignKey: 'bidder_id' })
    })

    it('defined a hasMany association with Car model', () => {
      expect(User.hasMany).toHaveBeenCalledWith(Car, { as: 'cars', foreignKey: 'owner_id' })
    })
  })
})
