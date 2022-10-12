module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bids', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      auction_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'auctions',
          key: 'id',
        },
      },
      bidder_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      bid: {
        type: Sequelize.DECIMAL(10, 3),
        notEmpty: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'refused'),
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
    await queryInterface.dropTable('bids')
  },
}
