const create = require('../../indices/create')
const updateSettings = require('../../indices/settings/updateSettings')
const updateMapping = require('../../indices/mapping/update')

const { cars } = require('./index')
const settings = require('./settings')
const mapping = require('./mapping/v1')

const createIndex = async () => {
  const { index: indexName } = cars

  const createdIndex = await create(cars)

  if (createdIndex) {
    await updateSettings({ indexName, settings })
    await updateMapping({ indexName, mapping })
  }
}

if (require.main === module) createIndex()

module.exports = createIndex
