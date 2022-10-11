module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      },
    },
  }, {
    underscored: true,
    tableName: 'users',
  }
  )

  User.associate = models => {
    User.hasMany(models.Car, { as: 'cars', foreignKey: 'owner_id' })
    User.hasMany(models.Bid, { as: 'bids', foreignKey: 'bidder_id' })
  }

  return User
}
