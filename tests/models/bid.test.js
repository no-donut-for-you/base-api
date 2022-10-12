const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const BidModel = require('../../src/models/bid')
const User = require('../../src/models/user')
const Auction = require('../../src/models/auction')

describe('Bid', () => {
  const Bid = BidModel(sequelize, dataTypes)
  const bid = new Bid()

  checkModelName(Bid)('Bid')

  describe('properties', () => {
    ['bid', 'status'].forEach(
      checkPropertyExists(bid)
    )
  })

  describe('associations', () => {
    beforeEach(() => {
      Bid.associate({ Auction , User})
    })

    it('defined a belongsTo association with Auction model', () => {
      expect(Bid.belongsTo).toHaveBeenCalledWith(Auction, { as: 'auction', foreignKey: 'auction_id' })
    })

    it('defined a belongsTo association with User model', () => {
      expect(Bid.belongsTo).toHaveBeenCalledWith(User, { as: 'bidder', foreignKey: 'bidder_id' })
    })
  })
})
