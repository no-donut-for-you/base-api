const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const AuctionModel = require('../../src/models/auction')
const Car = require('../../src/models/car')
const Bid = require('../../src/models/bid')

describe('Auction', () => {
  const Auction = AuctionModel(sequelize, dataTypes)
  const auction = new Auction()

  checkModelName(Auction)('Auction')

  describe('properties', () => {
    ['name', 'min_bid', 'status'].forEach(
      checkPropertyExists(auction)
    )
  })

  describe('associations', () => {
    beforeEach(() => {
      Auction.associate({ Car, Bid })
    })

    it('defined a belongsTo association with Car model', () => {
      expect(Auction.belongsTo).toHaveBeenCalledWith(Car, { as: 'car', foreignKey: 'car_id' })
    })

    it('defined a hasMany association with Bids model', () => {
      expect(Auction.hasMany).toHaveBeenCalledWith(Bid, { as: 'bids', foreignKey: 'bidder_id' })
    })
  })
})
