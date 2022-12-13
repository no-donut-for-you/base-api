const Elasticsearch = require('../../elasticsearch')
const updateSettings = require('../../indices/settings/updateSettings')

const { Car } = require('../../../models')
const { cars } = require('./index')

const indexName = cars.index
const esClient = Elasticsearch()

const syncData = async () => {
  console.info('Started sync data')

  let batchSize = process.env.BATCH_SIZE || 100
  let offset = 0

  let totalDocuments = batchSize

  const totalCount = await Car.count()

  console.info('Total', totalCount)

  let indexedDocumentsCount = 0

  while (totalDocuments === batchSize) {
    const cars = await Car.findAll({
      attributes: ['id', 'name', 'description', 'year', 'chassis'],
      offset,
    })

    if (!cars.length) {
      console.info('No cars to index')

      return
    }

    try {
      const body = cars.flatMap(doc => [{ index: { _index: indexName } }, doc])

      const bulkResponse = await esClient.bulk(body)

      if (bulkResponse.errors) {
        const failedDocuments = bulkResponse.items.filter(document => document.index.result !== 'created')

        for (const document of failedDocuments) {
          const { type, reason } = document.index.error
          console.error(`Error indexing document: ${document.index._id}`, { type, reason })
        }
      }

      indexedDocumentsCount += bulkResponse.items.filter(document => document.index.result === 'created').length
    } catch (error) {
      console.error('Error indexing documents: ', error)
    }

    console.info(`Indexed ${indexedDocumentsCount} of ${totalCount} cars`)

    batchSize = cars.length
    offset += batchSize
  }

  return { indexedDocumentsCount, totalCount }
}

if (require.main === module) {
  (async () => {
    try {
      await syncData()

      await updateSettings({
        indexName,
        settings: {
          number_of_replicas: process.env.NUMBER_OF_REPLICAS || 1,
        },
      })

      process.exit(0)
    } catch (error) {
      console.error(error)

      process.exit(1)
    }
  })()
}
