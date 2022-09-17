const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
} = require('sequelize-jest-helpers')

const JobModel = require('../../src/models/job')
const Contract = require('../../src/models/contract')

describe('Job', () => {
  const Job = JobModel(sequelize, dataTypes)
  const job = new Job()

  checkModelName(Job)('Job')

  describe('properties', () => {
    ['contractId', 'description', 'price', 'paid', 'paymentDate'].forEach(
      checkPropertyExists(job)
    )
  })

  describe('associations', () => {
    beforeEach(() => {
      Job.associate({ Contract })
    })

    it('defined a belongsTo association with Contract model', () => {
      expect(Job.belongsTo).toHaveBeenCalledWith(Contract, {
        as: 'contract',
        foreignKey: 'contract_id',
      })
    })
  })
})
