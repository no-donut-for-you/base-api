module.exports = {
  async up(queryInterface, Sequelize) {
    const brands = [
      {
        id: 1,
        name: 'Aston Martin',
        description:
          'Aston Martin Lagonda Global Holdings PLC is an English manufacturer of luxury sports cars and grand tourers. It was founded in 1913 by Lionel Martin and Robert Bamford. Aston Martin has held a Royal Warrant as purveyor of motorcars to HRH The Prince of Wales since 1982. The company went into receivership in 2007, but has since returned to profitability. In 2018, Aston Martin was bought by a consortium led by Lawrence Stroll, owner of the Canadian racing team Racing Point F1',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 2,
        name: 'Ferrari',
        description: 'Ferrari S.p.A. is an Italian luxury sports car manufacturer based in Maranello. Founded by Enzo Ferrari in 1939 as Auto Avio Costruzioni, the company built its first car in 1940. However, the company\'s inception as an auto manufacturer is usually recognized in 1947, when the first Ferrari-badged car was completed. Ferrari is the world\'s most powerful according to Brand Finance. In May 2012 the 1962 Ferrari 250 GTO became the most expensive car in history, selling for US$38.1 million including fees. In 2016, the Ferrari 250 GTO was again the most expensive car in the world, selling for $52 million. As of 2018, the 1964 Ferrari 275 GTB/4*S NART Spider is the most expensive car in the world, having been sold for $70 million.',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        id: 3,
        name: 'Porche',
        description: 'Porche AG is a German automobile manufacturer specializing in high-performance sports cars, SUVs and sedans. The headquarters of Porche AG is in Stuttgart, and the production sites are in Stuttgart-Zuffenhausen, Leipzig, and Braunschweig. The company is owned by Volkswagen AG, a controlling stake of which is owned by Porsche Automobil Holding SE. Porsche\'s current lineup includes the 718 Boxster/Cayman, 911, Panamera, Macan, and Cayenne. Porche was founded in 1931 by Ferdinand Porche who was inspired by',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    ]

    await queryInterface.bulkInsert('brands', brands, {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('brands', null, {})
  }
}
