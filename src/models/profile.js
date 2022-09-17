module.exports = function (sequelize, DataTypes) {
  const Profile = sequelize.define(
    'Profile', {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.ENUM,
        validate: { notEmpty: true },
        values: ['client', 'contractor'],
      },
      balance: {
        type: DataTypes.REAL(10, 2),
      },
    }, {
      underscored: true,
      tableName: 'profiles',
    }
  )

  Profile.associate = models => {
    Profile.hasMany(models.Contract, { as: 'contractor_contracts', foreignKey: 'contractor_id' })
    Profile.hasMany(models.Contract, { as: 'client_contracts', foreignKey: 'client_id' })
  }

  return Profile
}
