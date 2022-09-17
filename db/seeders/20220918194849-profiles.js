module.exports = {
  async up(queryInterface, Sequelize) {
    const profiles = [
      {
        id: 1,
        first_name: 'Harry',
        last_name: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        first_name: 'Mr',
        last_name: 'Robot',
        profession: 'Hacker',
        balance: 231.11,
        type: 'client',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        first_name: 'John',
        last_name: 'Snow',
        profession: 'Knows nothing',
        balance: 451.3,
        type: 'client',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 4,
        first_name: 'Ash',
        last_name: 'Kethcum',
        profession: 'Pokemon master',
        balance: 1.3,
        type: 'client',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 5,
        first_name: 'John',
        last_name: 'Lenon',
        profession: 'Musician',
        balance: 64,
        type: 'contractor',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 6,
        first_name: 'Linus',
        last_name: 'Torvalds',
        profession: 'Programmer',
        balance: 1214,
        type: 'contractor',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 7,
        first_name: 'Alan',
        last_name: 'Turing',
        profession: 'Programmer',
        balance: 22,
        type: 'contractor',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 8,
        first_name: 'Aragorn',
        last_name: 'II Elessar Telcontarvalds',
        profession: 'Fighter',
        balance: 314,
        type: 'contractor',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('profiles', profiles, {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('profiles', null, {})
  }
}
