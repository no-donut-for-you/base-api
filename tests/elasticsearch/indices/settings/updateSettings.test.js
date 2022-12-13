const updatedSettings = require('../../../../src/elasticsearch/indices/settings/updateSettings')
const Elasticsearch = require('../../../../src/elasticsearch/elasticsearch')

jest.mock('../../../../src/elasticsearch/elasticsearch', () => {
  const client = {
    indexExists: jest.fn(),
    closeIndex: jest.fn(),
    openIndex: jest.fn(),
    updateSettings: jest.fn(),
  }

  return () => client
})

console.info = jest.fn()
console.error = jest.fn()

describe('Update index settings', () => {
  const indexName = 'fake'
  const settings = { fake: 'fake' }

  const esClient = Elasticsearch()

  describe('When index doesn\'t exist', () => {
    beforeEach(() => {
      esClient.indexExists.mockResolvedValueOnce(false)
    })

    it('should not update the index', async () => {
      const updateSettings = await updatedSettings({ indexName, settings })

      expect(console.info).toHaveBeenCalledWith('fake index does not exist')
      expect(updateSettings).toBeFalsy()
    })
  })

  describe('When index exists', () => {
    beforeEach(() => {
      esClient.indexExists.mockResolvedValueOnce(true)
    })

    it('should not update the index when some error throws', async () => {
      esClient.closeIndex.mockRejectedValue(new Error('fake error'))

      const updateSettings = await updatedSettings({ indexName, settings })

      expect(console.error).toHaveBeenCalledWith({
        error: 'fake error',
        message: 'fake index settings not updated',
      })
      expect(updateSettings).toBeFalsy()
    })

    it('should update the index', async () => {
      esClient.closeIndex.mockResolvedValue(true)
      esClient.updateSettings.mockResolvedValue(true)
      esClient.openIndex.mockResolvedValue(true)

      const updateSettings = await updatedSettings({ indexName, settings })

      expect(esClient.closeIndex).toHaveBeenCalledWith(indexName)
      expect(console.info).toHaveBeenCalledWith('fake index settings updated')
      expect(esClient.openIndex).toHaveBeenCalledWith(indexName)
      expect(updateSettings).toBeTruthy()
    })
  })
})
