module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contracts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      terms: {
        type: Sequelize.TEXT,
        notEmpty: true,
      },
      status: {
        type: Sequelize.ENUM('new', 'in_progress', 'terminated'),
        notEmpty: true,
      },
      client_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      contractor_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'profiles',
          key: 'id',
        },
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

    await queryInterface.addIndex('contracts', ['status'], {
      indexName: 'contracts_status',
    })

    await queryInterface.addIndex('contracts', ['status', 'contractor_id', 'client_id'], {
      indexName: 'contracts_status_and_contractor_id_and_client_id',
    })

    await queryInterface.addIndex('contracts', ['id', 'contractor_id', 'client_id'], {
      indexName: 'contracts_id_and_contractor_id_and_client_id',
    })

    await queryInterface.addIndex('contracts', ['id', 'contractor_id'], {
      indexName: 'contracts_id_and_contractor_id',
    })

    await queryInterface.addIndex('contracts', ['id', 'client_id'], {
      indexName: 'contracts_id_and_client_id',
    })
  },

  down: async queryInterface => {
    await queryInterface.dropTable('contracts')
  },
}
