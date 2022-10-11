module.exports = {
  async up(queryInterface, Sequelize) {
    const auctions = [
      {
        id: 1,
        name: 'Porshe 912 1965 auction',
        car_id: 3,
        min_bid: 80.000,
        status: 'live',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        name: 'Aston Martin DB Mark III auction',
        car_id: 1,
        min_bid: 150.000,
        status: 'live',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('auctions', auctions, {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('auctions', null, {})
  }
}
