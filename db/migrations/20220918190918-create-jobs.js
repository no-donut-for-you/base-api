module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
        notEmpty: true,
      },
      contract_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'contracts',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.REAL(10, 2),
        defaultValue: 0,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        notEmpty: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    await queryInterface.addIndex('jobs', ['paid'], {
      indexName: 'jobs_paid',
    })

    await queryInterface.addIndex('jobs', ['id', 'paid'], {
      indexName: 'jobs_id_and_paid',
    })
  },

  down: async queryInterface => {
    await queryInterface.dropTable('jobs')
  },
}
