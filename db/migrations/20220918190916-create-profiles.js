module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
      },
      balance: {
        type: Sequelize.REAL(10, 2),
        defaultValue: 0,
      },
      type: {
        type: Sequelize.ENUM('client', 'contractor'),
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

    await queryInterface.addIndex('profiles', ['id', 'type'], {
      indexName: 'profiles_id_and_type',
    })
  },

  down: async queryInterface => {
    await queryInterface.dropTable('profiles')
  },
}
