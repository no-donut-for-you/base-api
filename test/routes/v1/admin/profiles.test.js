const request = require('supertest')
const { Op, fn, col } = require('sequelize')

const app = require('../../../../app')
const { Profile, Contract, Job } = require('../../../../src/models')
const { validateDates } = require('../../../../src/routes/v1/admin/profiles')

const appClient = request(app)

process.env.BASIC_AUTH_USERNAME = 'fake'
process.env.BASIC_AUTH_PASSWORD = 'fake'

jest.mock('../../../../src/models', () => ({
  Contract: jest.fn(),
  Job: jest.fn(),
  Profile: { findAll: jest.fn() },
}))

describe('validateDates', () => {
  it('returns 400 if start or end are not provided', () => {
    const req = { query: {} }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    validateDates(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'start and end are required' })
  })

  it('returns 400 if start or end are not valid dates', () => {
    const req = { query: { start: 'fake', end: 'fake' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    validateDates(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'start and end must be valid dates. Date format is: MM-DD-YYYY' })
  })

  it('returns start and end dates if they are valid', () => {
    const req = { query: { start: '01-01-2019', end: '01-01-2020' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const result = validateDates(req, res)

    expect(result.startDate).toEqual('01-01-2019')
    expect(result.endDate).toEqual('01-01-2020')
  })
})

describe('GET /admin/v1/best-profession', () => {
  const startDate = '09-17-2022'
  const endDate = '09-17-2022'

  jest.mock('../../../../src/routes/v1/admin/profiles', () => ({
    validateDates: jest.fn().mockReturnValue({ startDate, endDate }),
  }))

  const path = '/admin/v1/best-profession'

  it('should return the best paid profession', async () => {
    await Profile.findAll.mockReturnValueOnce([{ fake: 'fake' }])

    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .query({ start: startDate, end: endDate })

    expect(Profile.findAll).toHaveBeenCalledWith({
      attributes: [
        'profession',
        [
          fn('coalesce', fn('sum', col('contractor_contracts.jobs.price')), 0),
          'total',
        ],
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

    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ bestPaidProfession: { fake: 'fake' } })
  })
})

describe('GET /admin/v1/best-clients', () => {
  const startDate = '09-17-2022'
  const endDate = '09-17-2022'

  jest.mock('../../../../src/routes/v1/admin/profiles', () => ({
    validateDates: jest.fn().mockReturnValue({ startDate, endDate }),
  }))

  const path = '/admin/v1/best-clients'

  it('should return an error when start or end date are not provided', async () => {
    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .query({ end: '9-17-2022' })

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ error: 'start and end are required' })
  })

  it('should return an error when start or end date format are invalid', async () => {
    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .query({ start: '1', end: '9-17-2022' })

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({
      error: 'start and end must be valid dates. Date format is: MM-DD-YYYY',
    })
  })

  it('should return the best paid profession', async () => {
    await Profile.findAll.mockReturnValueOnce([{ fake: 'fake' }])

    const start = '09-17-2022'
    const end = '09-17-2022'

    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .query({ start, end })

    expect(Profile.findAll).toHaveBeenCalledWith({
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
      limit: 2,
    })

    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ bestClients: [{ fake: 'fake' }] })
  })
})
