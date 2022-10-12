const { cars } = require('../../../../src/elasticsearch/cars/index/index')

const mapping = require('../../../../src/elasticsearch/cars/index/mapping/v1')
const settings = require('../../../../src/elasticsearch/cars/index/settings')

const createCarsIndex = require('../../../../src/elasticsearch/cars/index/create')

const createIndex = require('../../../../src/elasticsearch/indices/create')
const updateMapping = require('../../../../src/elasticsearch/indices/mapping/update')
const updateSettings = require('../../../../src/elasticsearch/indices/settings/updateSettings')

jest.mock('../../../../src/elasticsearch/indices/create')
jest.mock('../../../../src/elasticsearch/indices/mapping/update')
jest.mock('../../../../src/elasticsearch/indices/settings/updateSettings')

describe('Cars index creation', () => {
  it('should create the cars index', async () => {
    createIndex.mockResolvedValueOnce(true)

    await createCarsIndex()

    expect(createIndex).toHaveBeenCalledWith(cars)
    expect(updateSettings).toHaveBeenCalledWith({ indexName: cars.index, settings })
    expect(updateMapping).toHaveBeenCalledWith({ indexName: cars.index, mapping })
  })
})
