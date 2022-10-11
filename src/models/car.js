module.exports = function (sequelize, DataTypes) {
  const Car = sequelize.define('Car', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    chassis: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },

  }, {
    underscored: true,
    tableName: 'cars'
  })

  Car.associate = models => {
    Car.belongsTo(models.User, { as: 'user', foreignKey: 'owner_id' })
    Car.belongsTo(models.Brand, { as: 'brand', foreignKey: 'brands' })
    Car.hasMany(models.Auction, { as: 'auctions', foreignKey: 'car_id' })
  }

  return Car
}
