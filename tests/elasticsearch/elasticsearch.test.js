const esClient = require('@elastic/elasticsearch')
const Elasticsearch = require('../../src/elasticsearch/elasticsearch')

jest.mock('@elastic/elasticsearch', () => {
  const client = {
    indices: {
      exists: jest.fn(),
      create: jest.fn(),
      putMapping: jest.fn(),
      close: jest.fn(),
      open: jest.fn(),
      delete: jest.fn(),
      putSettings: jest.fn(),
    },
    bulk: jest.fn(),
    count: jest.fn(),
  }

  return { Client: jest.fn(() => client) }
})

describe('Elasticsearch', () => {
  const elasticsearch = Elasticsearch()
  const client = esClient.Client()

  const index = {
    index: 'fake',
    body: {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 2,
      },
    },
  }

  const mapping = {
    properties: {
      fake: { type: 'keyword' },
    }
  }

  describe('indexExists', () => {
    it('should call exists function from Elasticsearch client', async () => {
      await elasticsearch.indexExists('fake')

      expect(client.indices.exists).toHaveBeenCalledWith({ index: 'fake' })
    })
  })

  describe('createdIndex', () => {
    it('should call create function from Elasticsearch client', async () => {
      await elasticsearch.createIndex(index)

      expect(client.indices.create).toHaveBeenCalledWith({ ...index })
    })
  })

  describe('updateMapping', () => {
    it('should call putMapping function from Elasticsearch client', async () => {
      await elasticsearch.updateMapping({ index, mapping })

      expect(client.indices.putMapping).toHaveBeenCalledWith({ index, body: mapping })
    })
  })

  describe('closeIndex', () => {
    it('should call close function from Elasticsearch client', async () => {
      await elasticsearch.closeIndex('fake')

      expect(client.indices.close).toHaveBeenCalledWith({ index: 'fake' })
    })
  })

  describe('openIndex', () => {
    it('should call open function from Elasticsearch client', async () => {
      await elasticsearch.openIndex('fake')

      expect(client.indices.open).toHaveBeenCalledWith({ index: 'fake' })
    })
  })

  describe('deleteIndex', () => {
    it('should call delete function from Elasticsearch client', async () => {
      await elasticsearch.deleteIndex('fake')

      expect(client.indices.delete).toHaveBeenCalledWith({ index: 'fake' })
    })
  })

  describe('updateSettings', () => {
    it('should call putSettings function from Elasticsearch client', async () => {
      await elasticsearch.updateSettings({ index, settings: index.body.settings })

      expect(client.indices.putSettings).toHaveBeenCalledWith({ index, body: index.body.settings })
    })
  })

  describe('bulk', () => {
    it('should call bulk function from Elasticsearch client', async () => {
      await elasticsearch.bulk('fake')

      expect(client.bulk).toHaveBeenCalledWith({ refresh: true, body: 'fake' })
    })
  })

  describe('count', () => {
    it('should call count function from Elasticsearch client', async () => {
      await elasticsearch.count('fake')

      expect(client.count).toHaveBeenCalledWith('fake')
    })
  })
})
