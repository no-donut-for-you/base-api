module.exports = {
  async up(queryInterface, Sequelize) {
    const contracts = [
      {
        id: 1,
        terms: 'bla bla bla',
        status: 'terminated',
        client_id: 1,
        contractor_id: 5,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 1,
        contractor_id: 6,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 2,
        contractor_id: 6,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 4,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 2,
        contractor_id: 7,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 5,
        terms: 'bla bla bla',
        status: 'new',
        client_id: 3,
        contractor_id: 8,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 6,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 3,
        contractor_id: 7,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 7,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 4,
        contractor_id: 7,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 8,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 4,
        contractor_id: 6,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 9,
        terms: 'bla bla bla',
        status: 'in_progress',
        client_id: 4,
        contractor_id: 8,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('contracts', contracts, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('contracts', null, {})
  },
}
