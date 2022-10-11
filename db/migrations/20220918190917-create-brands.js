module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('brands', {
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    await queryInterface.addIndex('brands', ['name'], {
      indexName: 'brands_name',
    })
  },

  down: async queryInterface => {
    await queryInterface.dropTable('brands')
  },
}
