const Elasticsearch = require('../../elasticsearch')

const updateSettings = async ({ indexName, settings }) => {
  const esClient = Elasticsearch()

  try {
    const indexExists = await esClient.indexExists(indexName)

    if (!indexExists) {
      console.info(`${indexName} index does not exist`)

      return false
    }

    await esClient.closeIndex(indexName)

    const updatedSettings = await esClient.updateSettings({ index: indexName, settings })

    await esClient.openIndex(indexName)

    if (updatedSettings) console.info(`${indexName} index settings updated`)

    return true
  } catch (error) {
    console.error({
      message: `${indexName} index settings not updated`,
      error: error.message,
    })

    return false
  }
}

module.exports = updateSettings
