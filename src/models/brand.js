module.exports = function (sequelize, DataTypes) {
  const Brand = sequelize.define('Brand', {
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

  }, {
    underscored: true,
    tableName: 'brands'
  })

  Brand.associate = models => {
    Brand.hasMany(models.Car, { as: 'cars', foreignKey: 'brand_id' })
  }

  return Brand
}
