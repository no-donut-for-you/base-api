module.exports = function (sequelize, DataTypes) {
  const Auction = sequelize.define('Auction', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    min_bid: {
      type: DataTypes.DECIMAL(10, 3),
    },
    status: {
      type: DataTypes.ENUM,
      validate: { notEmpty: true },
      values: ['live', 'paused', 'finished'],
    },

  }, {
    underscored: true,
    tableName: 'auctions'
  })

  Auction.associate = models => {
    Auction.belongsTo(models.Car, { as: 'car', foreignKey: 'car_id' })
    Auction.hasMany(models.Bid, { as: 'bids', foreignKey: 'bidder_id' })
  }

  return Auction
}
