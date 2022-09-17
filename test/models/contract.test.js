const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const ContractModel = require('../../src/models/contract')
const Profile = require('../../src/models/profile')
const Job = require('../../src/models/job')

describe('Contract', () => {
  const Contract = ContractModel(sequelize, dataTypes)
  const contract = new Contract()

  checkModelName(Contract)('Contract')

  describe('properties', () => {
    ['clientId', 'contractorId', 'terms', 'status'].forEach(checkPropertyExists(contract))
  })

  describe('associations', () => {
    beforeEach(() => {
      Contract.associate({ Profile, Job })
    })

    it('defined a belongsTo association with Profile model', () => {
      expect(Contract.belongsTo).toHaveBeenCalledWith(Profile, { as: 'contractor', foreignKey: 'contractor_id' })
      expect(Contract.belongsTo).toHaveBeenCalledWith(Profile, { as: 'client', foreignKey: 'client_id' })
    })

    it('defined a hasMany association with Job model', () => {
      expect(Contract.hasMany).toHaveBeenCalledWith(Job, { as: 'jobs', foreignKey: 'contract_id' })
    })
  })
})
