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
  },

  down: async queryInterface => {
    await queryInterface.dropTable('contracts')
  },
}
