const updateMapping = require('../../../../src/elasticsearch/indices/mapping/update')
const Elasticsearch = require('../../../../src/elasticsearch/elasticsearch')

jest.mock('../../../../src/elasticsearch/elasticsearch', () => {
  const client = {
    indexExists: jest.fn(),
    updateMapping: jest.fn(),
  }

  return () => client
})

console.info = jest.fn()
console.error = jest.fn()

describe('Mapping update', () => {
  const indexName = 'fake'
  const mapping = {
    fake: 'fake'
  }

  const esClient = Elasticsearch()

  describe('When index doesn\'t exist', () => {
    beforeEach(() => {
      esClient.indexExists.mockResolvedValueOnce(false)
    })

    it('should not update the mapping if the index doesn\'t exist', async () => {
      const update = await updateMapping({ indexName, mapping })

      expect(console.info).toHaveBeenCalledWith('fake index does not exist')
      expect(update).toBeFalsy()
    })
  })

  describe('When index exists', () => {
    beforeEach(() => {
      esClient.indexExists.mockResolvedValueOnce(true)
    })

    it('should not update the index mapping if some error throws', async () => {
      esClient.updateMapping.mockRejectedValue(new Error('fake error'))

      const update = await updateMapping({ indexName, mapping })

      expect(console.error).toHaveBeenCalledWith({
        error: 'fake error',
        message: 'fake index mapping not updated',
      })
      expect(update).toBeFalsy()
    })

    it('should update the index mapping', async () => {
      esClient.updateMapping.mockResolvedValueOnce(true)
      const update = await updateMapping({ indexName, mapping })

      expect(console.info).toHaveBeenCalledWith('fake index mapping updated')
      expect(update).toBeTruthy()
    })
  })
})
