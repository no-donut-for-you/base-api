module.exports = function (sequelize, DataTypes) {
  const Contract = sequelize.define('Contract', {
    clientId: {
      type: DataTypes.INTEGER,
      // field: 'client_id',
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    contractorId: {
      type: DataTypes.INTEGER,
      // field: 'contractor_id',
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      validate: { notEmpty: true },
      values: ['new','in_progress','terminated']
    }

  }, {
    underscored: true,
    tableName: 'contracts'
  })

  Contract.associate = models => {
    Contract.belongsTo(models.Profile, { as: 'contractor', foreignKey: 'contractor_id' })
    Contract.belongsTo(models.Profile, { as: 'client', foreignKey: 'client_id' })
    Contract.hasMany(models.Job, { as: 'jobs', foreignKey: 'contract_id' })
  }

  return Contract
}
