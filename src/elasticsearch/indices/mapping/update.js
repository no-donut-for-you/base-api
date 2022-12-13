const Elasticsearch = require('../../elasticsearch')

const update = async ({ indexName, mapping }) => {
  const esClient = Elasticsearch()

  try {
    const indexExists = await esClient.indexExists(indexName)

    if (!indexExists) {
      console.info(`${indexName} index does not exist`)

      return false
    }

    const updatedMapping = await esClient.updateMapping({ index: indexName, mapping })

    if (updatedMapping) console.info(`${indexName} index mapping updated`)

    return true
  } catch (error) {
    console.error({
      message: `${indexName} index mapping not updated`,
      error: error.message,
    })

    return false
  }
}

module.exports = update
