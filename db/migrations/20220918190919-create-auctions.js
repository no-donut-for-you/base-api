module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('auctions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.TEXT,
        notEmpty: true,
      },
      car_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'cars',
          key: 'id',
        },
      },
      min_bid: {
        type: Sequelize.DECIMAL(10, 3),
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('live', 'paused', 'finished'),
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
  },

  down: async queryInterface => {
    await queryInterface.dropTable('auctions')
  },
}
