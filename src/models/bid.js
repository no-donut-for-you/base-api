module.exports = function (sequelize, DataTypes) {
  const Bid = sequelize.define('Bid', {
    bid: {
      type: DataTypes.DECIMAL(10, 3),
    },
    status: {
      type: DataTypes.ENUM,
      validate: { notEmpty: true },
      values: ['active', 'refused'],
    },

  }, {
    underscored: true,
    tableName: 'bids',
  })

  Bid.associate = models => {
    Bid.belongsTo(models.Auction, { as: 'auction', foreignKey: 'auction_id' })
    Bid.belongsTo(models.User, { as: 'bidder', foreignKey: 'bidder_id' })
  }

  return Bid
}
