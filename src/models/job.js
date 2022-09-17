module.exports = function (sequelize, DataTypes) {
  const Job = sequelize.define('Job', {
    contractId: {
      type: DataTypes.INTEGER,
      field: 'contract_id',
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.REAL(10, 2),
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    underscored: true,
    tableName: 'jobs'
  })

  Job.associate = models => {
    Job.belongsTo(models.Contract, { as: 'contract', foreignKey: 'contract_id' })
  }

  return Job
}
