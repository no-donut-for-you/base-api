const create = require('../../../src/elasticsearch/indices/create')
const Elasticsearch = require('../../../src/elasticsearch/elasticsearch')

jest.mock('../../../src/elasticsearch/elasticsearch', () => {
  const client = {
    indexExists: jest.fn(),
    createIndex: jest.fn(),
  }

  return () => client
})

console.info = jest.fn()
console.error = jest.fn()

describe('Indices create', () => {
  const index = {
    index: 'fake',
    body: {
      fake: 'fake'
    }
  }

  const esClient = Elasticsearch()

  describe('When index exists', () => {
    esClient.indexExists.mockResolvedValueOnce(true)

    it('should not create the index', async () => {
      const createIndex = await create(index)

      expect(console.info).toHaveBeenCalledWith('fake index already exists')
      expect(createIndex).toBeFalsy()
    })
  })

  describe('When index doesn\'t  exist', () => {
    esClient.indexExists.mockResolvedValueOnce(false)

    it('should not create the index if some error throws', async () => {
      esClient.createIndex.mockRejectedValue(new Error('fake error'))

      const createIndex = await create(index)

      expect(console.error).toHaveBeenCalledWith({'error': 'fake error', 'message': 'fake index not created'})
      expect(createIndex).toBeFalsy()
    })

    it('should create the index if the index doesn\'t exist', async () => {
      esClient.createIndex.mockResolvedValue(true)

      const createIndex = await create(index)

      expect(console.info).toHaveBeenCalledWith('fake index created')
      expect(createIndex).toBeTruthy()
    })
  })
})
