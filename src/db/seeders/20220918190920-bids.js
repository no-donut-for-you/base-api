module.exports = {
  async up(queryInterface, Sequelize) {
    const bids = [
      {
        id: 1,
        auction_id: 1,
        bidder_id: 2,
        bid: 85.000,
        status: 'active',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        auction_id: 1,
        bidder_id: 3,
        bid: 88.000,
        status: 'active',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('bids', bids, {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('bids', null, {})
  }
}
