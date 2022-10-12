module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: 1,
        name: 'Nikole Tesle',
        email: 'nikole.tesle@tesle.com',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        name: 'Mr. Lipsum',
        email: 'mr.lipsum@lorem.com',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        name: 'Alice',
        email: 'alice@alice.me',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('users', users, {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', null, {})
  }
}
