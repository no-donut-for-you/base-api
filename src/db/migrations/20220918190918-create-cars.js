module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cars', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
      },
      description: {
        type: Sequelize.TEXT,
        notEmpty: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      brand_id: {
        type: Sequelize.INTEGER,
        notEmpty: true,
        references: {
          model: 'brands',
          key: 'id',
        },
      },
      year: {
        type: Sequelize.INTEGER,
        notEmpty: true,
      },
      chassis: {
        type: Sequelize.STRING,
        allowNull: false,
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

    await queryInterface.addIndex('cars', ['name'], {
      indexName: 'cars_name',
    })
  },

  down: async queryInterface => {
    await queryInterface.dropTable('cars')
  },
}
