const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-jest-helpers')

const ProfileModel = require('../../src/models/profile')
const Contract = require('../../src/models/contract')

describe('Profile', () => {
  const Profile = ProfileModel(sequelize, dataTypes)
  const profile = new Profile()

  checkModelName(Profile)('Profile')

  describe('properties', () => {
    ['firstName', 'lastName', 'profession', 'type', 'balance'].forEach(checkPropertyExists(profile))
  })

  describe('associations', () => {
    beforeEach(() => {
      Profile.associate({ Contract })
    })

    it('defined a hasMany association with Contract model', () => {
      expect(Profile.hasMany).toHaveBeenCalledWith(Contract, { as: 'contractor_contracts', foreignKey: 'contractor_id' })
      expect(Profile.hasMany).toHaveBeenCalledWith(Contract, { as: 'client_contracts', foreignKey: 'client_id' })
    })
  })
})
