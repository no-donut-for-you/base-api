const Elasticsearch = require('../elasticsearch')

const create = async index => {
  const { index: indexName } = index
  const esClient = Elasticsearch()

  const indexExists = await esClient.indexExists(indexName)

  if (indexExists) {
    console.info(`${indexName} index already exists`)

    return false
  }

  try {
    const createdIndex = await esClient.createIndex(index)

    if (createdIndex) console.info(`${indexName} index created`)

    return true
  } catch (error) {
    console.error({
      message: `${indexName} index not created`,
      error: error.message,
    })

    return false
  }
}

module.exports = create
