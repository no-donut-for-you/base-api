const request = require('supertest')
const { Op } = require('sequelize')

const app = require('../../../../app')
const { Profile, Contract, Job, sequelize } = require('../../../../src/models')

jest.mock('../../../../src/models', () => ({
  Contract: jest.fn(),
  Profile: { findOne: jest.fn() },
  Job: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn().mockReturnValue({
      commit: jest.fn(),
      rollback: jest.fn(),
    }),
  },
}))

const mockJob = {
  fake: 'fake',
  price: 10,
  update: jest.fn(),
  reload: jest.fn(),
  contract: {
    client: { id: 'fake', balance: 10, decrement: jest.fn() },
    contractor: { increment: jest.fn() },
  },
}

const appClient = request(app)

process.env.BASIC_AUTH_USERNAME = 'fake'
process.env.BASIC_AUTH_PASSWORD = 'fake'

describe('GET /api/v1/jobs/unpaid', () => {
  const path = '/api/v1/jobs/unpaid'

  beforeEach(() => {
    Profile.findOne.mockReturnValueOnce({ fake: 'fake' })
  })

  it('should query unpaid jobs', async () => {
    await Job.findAll.mockReturnValueOnce([{ fake: 'fake' }])

    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(Job.findAll).toHaveBeenCalledWith({
      attributes: [
        'id',
        'contractId',
        'description',
        'price',
        'paid',
        'paymentDate'
      ],
      where: {
        paid: false,
      },
      include: {
        model: Contract,
        as: 'contract',
        attributes: [],
        where: {
          status: 'in_progress',
          [Op.or]: [{ contractorId: 'fake' }, { clientId: 'fake' }],
        },
      },
    })
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ jobs: [{ fake: 'fake' }] })
  })
})

describe('POST /api/v1/jobs/:id/pay', () => {
  const path = '/api/v1/jobs/1/pay'

  beforeEach(() => {
    Profile.findOne.mockReturnValueOnce({ fake: 'fake' })
  })

  const expectedQuery = {
    attributes: [
      'id',
      'contractId',
      'description',
      'price',
      'paid',
      'paymentDate',
    ],
    where: {
      id: '1',
      paid: false,
    },
    include: {
      model: Contract,
      as: 'contract',
      attributes: ['id', 'clientId', 'contractorId', 'terms', 'status'],
      where: {
        status: 'in_progress',
        clientId: 'fake',
      },
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'profession', 'type', 'balance'],
          model: Profile,
          as: 'client',
        },
        {
          attributes: ['id', 'firstName', 'lastName', 'profession', 'type', 'balance'],
          model: Profile,
          as: 'contractor',
        },
      ],
    },
  }

  it('should return not found when job is not found', async () => {
    await Job.findOne.mockReturnValueOnce(null)

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(Job.findOne).toHaveBeenCalledWith(expectedQuery)
    expect(res.status).toEqual(404)
    expect(res.body).toEqual({ error: 'Job not found' })
  })

  it('should return error when client has insufficient funds', async () => {
    await Job.findOne.mockReturnValueOnce({
      fake: 'fake',
      price: 10,
      contract: { client: { id: 'fake', balance: 9 } }
    })

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(Job.findOne).toHaveBeenCalledWith(expectedQuery)

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({ error: 'Client fake has insufficient funds' })
  })

  it('should error when job pay fails', async () => {
    mockJob.update.mockRejectedValueOnce(new Error('Fake error'))
    await Job.findOne.mockReturnValueOnce(mockJob)

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    const transaction = await sequelize.transaction()

    expect(Job.findOne).toHaveBeenCalledWith(expectedQuery)
    expect(mockJob.update).toHaveBeenCalled()
    expect(transaction.rollback).toHaveBeenCalled()

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({ error: 'Fake error' })
  })

  it('should return success when job pay successfully', async () => {
    mockJob.update.mockReturnValueOnce(true)
    await Job.findOne.mockReturnValueOnce(mockJob)

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    const transaction = await sequelize.transaction()

    expect(Job.findOne).toHaveBeenCalledWith(expectedQuery)
    expect(mockJob.update).toHaveBeenCalled()
    expect(transaction.commit).toHaveBeenCalled()
    expect(transaction.rollback).not.toHaveBeenCalled()
    expect(res.status).toEqual(200)
  })
})
