const request = require('supertest')
const { Op } = require('sequelize')

const app = require('../../../../app')
const { Profile, Contract, Job } = require('../../../../src/models')

jest.mock('../../../../src/models', () => ({
  Profile: { findOne: jest.fn() },
  Contract: { findAll: jest.fn(), findOne: jest.fn() },
}))

const appClient = request(app)

process.env.BASIC_AUTH_USERNAME = 'fake'
process.env.BASIC_AUTH_PASSWORD = 'fake'

const contractAttributes = [
  'id',
  'clientId',
  'contractorId',
  'terms',
  'status',
]
const profileAttributes = [
  'id',
  'firstName',
  'lastName',
  'profession',
  'type',
  'balance',
]
const jobAttributes = [
  'id',
  'contractId',
  'description',
  'price',
  'paid',
  'paymentDate',
]

describe('GET /api/v1/contracts', () => {
  const path = '/api/v1/contracts'

  beforeEach(() => {
    Profile.findOne.mockReturnValueOnce({ fake: 'fake' })
  })

  it('should return contracts by contractorId or clientId and status different from "terminated"', async () => {
    await Contract.findAll.mockReturnValueOnce([{ fake: 'fake' }])

    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(Contract.findAll).toHaveBeenCalledWith({
      attributes: contractAttributes,
      where: {
        [Op.not]: { status: 'terminated' },
        [Op.or]: [{ contractorId: 'fake' }, { clientId: 'fake' }],
      },
      include: [
        {
          attributes: jobAttributes,
          model: Job,
          as: 'jobs',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'client',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'contractor',
        },
      ],
    })
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ contracts: [{ fake: 'fake' }] })
  })
})

describe('GET /api/v1/contracts/:id', () => {
  const path = '/api/v1/contracts/1'

  beforeEach(() => {
    Profile.findOne.mockReturnValueOnce({ fake: 'fake' })
  })

  it('should return a contract by contractorId or clientId and id', async () => {
    await Contract.findOne.mockReturnValueOnce({ fake: 'fake' })

    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(Contract.findOne).toHaveBeenCalledWith({
      attributes: contractAttributes,
      where: {
        id: '1',
        [Op.or]: [{ contractorId: 'fake' }, { clientId: 'fake' }],
      },
      include: [
        {
          attributes: jobAttributes,
          model: Job,
          as: 'jobs',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'client',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'contractor',
        },
      ],
    })
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ contract: { fake: 'fake' } })
  })

  it('should not return a contract when contractorId or clientId or id doest not match', async () => {
    await Contract.findOne.mockReturnValueOnce(null)

    const res = await appClient
      .get(path)
      .auth('fake', 'fake')
      .set('profile_id', 'fake')

    expect(Contract.findOne).toHaveBeenCalledWith({
      attributes: contractAttributes,
      where: {
        id: '1',
        [Op.or]: [{ contractorId: 'fake' }, { clientId: 'fake' }],
      },
      include: [
        {
          attributes: jobAttributes,
          model: Job,
          as: 'jobs',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'client',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'contractor',
        },
      ],
    })
    expect(res.status).toEqual(404)
    expect(res.body).toEqual({ errors: ['contract not found'] })
  })
})
