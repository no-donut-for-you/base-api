const express = require('express')
const moment = require('moment')
const { Op, fn, col } = require('sequelize')
const { Profile, Contract, Job } = require('../../../models')

const router = express.Router()

/* GET /best-profession */
router.get('/best-profession', async (req, res) => {
  const { start, end } = req.query

  if (!start || !end) {
    return res.status(400).json({ error: 'start and end are required' })
  }

  const startDate = moment(start, 'MM-DD-YYYY', true)
  const endDate = moment(end, 'MM-DD-YYYY', true)

  if (!startDate.isValid() || !endDate.isValid()) {
    return res
      .status(400)
      .json({ error: 'start and end must be valid dates. Date format is: MM-DD-YYYY' })
  }

  const profiles = await Profile.findAll({
    attributes: [
      'profession',
      [fn('coalesce', fn('sum', col('contractor_contracts.jobs.price')), 0), 'total'],
    ],
    include: [
      {
        model: Contract,
        attributes: [],
        as: 'contractor_contracts',
        include: [
          {
            model: Job,
            as: 'jobs',
            attributes: [],
            where: {
              paid: true,
              paymentDate: { [Op.between]: [start, end] },
            },
          },
        ],
      },
    ],
    subQuery: false,
    group: ['profession'],
    order: [['total', 'DESC']],
    limit: 1,
  })

  const bestPaidProfession = profiles[0]

  return res.status(200).json({ bestPaidProfession })
})

/* GET /best-clients */
router.get('/best-clients', async (req, res) => {
  const { start, end, limit = 2 } = req.query

  if (!start || !end) {
    return res.status(400).json({ error: 'start and end are required' })
  }

  const startDate = moment(start, 'MM-DD-YYYY', true)
  const endDate = moment(end, 'MM-DD-YYYY', true)

  if (!startDate.isValid() || !endDate.isValid()) {
    return res
      .status(400)
      .json({ error: 'start and end must be valid dates. Date format is: MM-DD-YYYY' })
  }

  const profiles = await Profile.findAll({
    attributes: [
      'id',
      'firstName',
      'lastName',
      [
        fn('coalesce', fn('sum', col('client_contracts.jobs.price')), 0),
        'total',
      ],
    ],
    include: [
      {
        model: Contract,
        attributes: [],
        as: 'client_contracts',
        include: [
          {
            model: Job,
            as: 'jobs',
            attributes: [],
            where: {
              paid: true,
              paymentDate: { [Op.between]: [start, end] },
            },
          },
        ],
      },
    ],
    subQuery: false,
    group: ['firstName', 'lastName'],
    order: [['total', 'DESC']],
    limit,
  })

  return res.status(200).json({ bestClients: profiles })
})

module.exports = router
