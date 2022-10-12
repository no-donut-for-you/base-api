module.exports = {
  async up(queryInterface, Sequelize) {
    const cars = [
      {
        id: 1,
        name: 'Porshe 912',
        description:
          'Porshe 912 is a sports car manufactured by Porsche AG of Germany from 1965 to 1969. It was the first Porsche model to be powered by a rear-mounted, air-cooled flat-six engine.',
        brand_id: 3,
        owner_id: 1,
        year: 1965,
        chassis: '912-001',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        name: 'Aston Martin DB Mark III',
        description:
          'The Aston Martin DB Mark III is a sports car that was manufactured by Aston Martin from 1959 to 1963. It was the third model in the DB series, and was the first to be fitted with a V8 engine.',
        brand_id: 1,
        owner_id: 3,
        year: 1960,
        chassis: 'DB3/1',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        name: 'Ferrari 250 GT Berlinetta SWB',
        description:
          'The Ferrari 250 GT Berlinetta SWB is a sports car manufactured by Ferrari from 1959 to 1963. It was the first Ferrari to be fitted with a V12 engine.',
        brand_id: 2,
        owner_id: 3,
        year: 1960,
        chassis: '250 GT SWB',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('cars', cars, {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('cars', null, {})
  }
}
