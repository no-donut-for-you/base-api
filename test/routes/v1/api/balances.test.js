const request = require('supertest')
const { Op, fn, col } = require('sequelize')

const app = require('../../../../app')
const { Contract, Job, Profile, sequelize } = require('../../../../src/models')

jest.mock('../../../../src/models', () => ({
  Contract: jest.fn(),
  Job: jest.fn(),
  Profile: { findOne: jest.fn() },
  sequelize: {
    transaction: jest.fn().mockReturnValue({
      commit: jest.fn(),
      rollback: jest.fn(),
    }),
  },
}))

const appClient = request(app)

process.env.BASIC_AUTH_USERNAME = 'fake'
process.env.BASIC_AUTH_PASSWORD = 'fake'

describe('POST /api/v1/balances/deposit/:clientId', () => {
  const path = '/api/v1/balances/deposit/1'

  beforeEach(() => {
    Profile.findOne.mockReturnValueOnce({ id: 'fake' })
  })

  const expectedQuery = {
    attributes: [
      'id',
      'balance',
      'type',
      [fn('SUM', col('client_contracts.jobs.price')), 'jobsTotalPrice']
    ],
    where: {
      id: '1',
      type: 'client'
    },
    include: {
      model: Contract,
      as: 'client_contracts',
      where: { [Op.not]: { status: 'terminated' } },
      attributes: [],
      include: {
        model: Job,
        as: 'jobs',
        where: { paid: false },
        attributes: [],
      },
    },
  }

  it('should return an error when profile id and client id does\'t match', async () => {
    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({ error: 'client ID and profile ID are not matching' })
  })

  it('should return an error when amount is not provided', async () => {
    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 1)

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ error: 'Missing amount' })
  })

  it('should return an error when profile is not client type', async () => {
    await Profile.findOne.mockReturnValueOnce({ dataValues: { type: 'fake' } })

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 1)
      .send({ amount: 10 })

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({ error: 'Only clients can make deposits' })
  })

  it('should return an error when client tries to deposit more than 25% of total of jobs to pay', async () => {
    await Profile.findOne.mockReturnValueOnce({ dataValues: { type: 'client', jobsTotalPrice: 100 } })

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 1)
      .send({ amount: 26 })

    expect(Profile.findOne).toHaveBeenCalledWith(expectedQuery)
    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ error: 'deposit can\'t be more than 25% of total of jobs to pay' })
  })

  it('should return an error when a client tries to deposit and an unexpected error happens', async () => {
    await Profile.findOne.mockReturnValueOnce({
      increment: jest.fn().mockRejectedValueOnce(new Error('Fake error')),
      dataValues: {
        type: 'client',
        jobsTotalPrice: 100,
      }
    })

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 1)
      .send({ amount: 10 })

    const transaction = await sequelize.transaction()

    expect(Profile.findOne).toHaveBeenCalledWith(expectedQuery)
    expect(transaction.rollback).toHaveBeenCalled()
    expect(res.status).toEqual(400)
    expect(res.body).toEqual({ error: 'Fake error' })
  })

  it('should return success when deposit successfully', async () => {
    await Profile.findOne.mockReturnValueOnce({
      increment: jest.fn(),
      dataValues: {
        type: 'client',
        jobsTotalPrice: 100,
      }
    })

    const res = await appClient
      .post(path)
      .auth('fake', 'fake')
      .set('profile_id', 1)
      .send({ amount: 10 })

    const transaction = await sequelize.transaction()

    expect(Profile.findOne).toHaveBeenCalledWith(expectedQuery)
    expect(transaction.commit).toHaveBeenCalled()
    expect(transaction.rollback).not.toHaveBeenCalled()
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ message: 'Deposit successful' })
  })
})
