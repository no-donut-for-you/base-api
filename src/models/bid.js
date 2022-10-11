module.exports = function (sequelize, DataTypes) {
  const Bid = sequelize.define('Bid',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
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
    Bid.belongsTo(models.Auction, { as: 'auction', foreignKey: 'bid_id' })
    Bid.belongsTo(models.User, { as: 'user', foreignKey: 'bidder_id' })
  }

  return Bid
}
