const express = require('express')
const moment = require('moment')
const { Op, fn, col } = require('sequelize')
const { Profile, Contract, Job } = require('../../../models')

const router = express.Router()

/**
* @swagger
* tags:
*   name: Admin/Profiles
*   description: Admin API to get profiles who are best paid or paid the most for jobs.
*/

const validateDates = (req, res) => {
  const format = 'MM-DD-YYYY'
  const { start, end } = req.query

  if (!start || !end) {
    return res.status(400).json({ error: 'start and end are required' })
  }

  const startDate = moment(start, format, true)
  const endDate = moment(end, format, true)

  if (!startDate.isValid() || !endDate.isValid()) {
    return res
      .status(400)
      .json({ error: 'start and end must be valid dates. Date format is: MM-DD-YYYY' })
  }

  return { startDate: startDate.format(format), endDate: endDate.format(format) }
}

/**
* @swagger
* /admin/v1/best-profession:
*   get:
*     tags: [Admin/Profiles]
*     security:
*      - basicAuth: []
*     summary: Get the most paid profession in a date range.
*     description:  Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
*     parameters:
*       - in: query
*         name: start
*         required: true
*         description: The start date to query best paid profession. Date format is MM-DD-YYYY
*         schema:
*           type: string
*       - in: query
*         name: end
*         required: true
*         description: The end date to query best paid profession. Date format is MM-DD-YYYY
*         schema:
*           type: string
*     responses:
*       200:
*         description: The bast paid profession.
*         content:
*           application/json:
*             schema:
*               properties:
*                 bestPaidProfession:
*                   type: object
*                   properties:
*                     profession:
*                       type: string
*                       description: The profession name.
*                       example: Programmer
*                     total:
*                       type: decimal
*                       description: The total paid
*                       example: 1399.99
*/
router.get('/best-profession', async (req, res) => {
  const { startDate, endDate } = validateDates(req, res)

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
              paymentDate: { [Op.between]: [startDate, endDate] },
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

/**
* @swagger
* /admin/v1/best-clients:
*   get:
*     tags: [Admin/Profiles]
*     security:
*      - basicAuth: []
*     summary: Get the clients that paid the most for jobs in a date range.
*     description:  Returns the clients that paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2
*     parameters:
*       - in: query
*         name: start
*         required: true
*         description: The start date to query clients that paid the most for jobs. Date format is MM-DD-YYYY
*         schema:
*           type: string
*       - in: query
*         name: end
*         required: true
*         description: The end date to query clients that paid the most for jobs. Date format is MM-DD-YYYY
*         schema:
*           type: string
*       - in: query
*         name: limit
*         required: false
*         description: The limit of clients to return. Default limit is 2
*         schema:
*           type: integer
*     responses:
*       200:
*         description: The clients that paid the most for jobs in a date range.
*         content:
*           application/json:
*             schema:
*               properties:
*                 bestClients:
*                   type: array
*                   properties:
*                     id:
*                       type: integer
*                       description: The client id.
*                       example: 1
*                     firstName:
*                       type: string
*                       description: The client first name.
*                       example: John
*                     lastName:
*                       type: string
*                       description: The client last name.
*                       example: Doe
*                     total:
*                       type: decimal
*                       description: The total paid
*                       example: 1399.99
*                     limit:
*                       type: integer
*                       optional: true
*                       description: The limit of clients to return. Default is 2
*                       example: 10
*/
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

module.exports = { router, validateDates }
