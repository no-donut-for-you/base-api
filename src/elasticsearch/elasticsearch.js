const { Client } = require('@elastic/elasticsearch')

const { ELASTIC_URL, ELASTIC_USERNAME, ELASTIC_PASSWORD } = process.env

const Elasticsearch = () => {
  const client = new Client({
    node: ELASTIC_URL,
    auth: {
      username: ELASTIC_USERNAME,
      password: ELASTIC_PASSWORD,
    },
  })

  const search = ({ index, query }) => {
    return client.search({ index, body: { query } })
  }

  const indexExists = index => {
    return client.indices.exists({ index })
  }

  const createIndex = index => {
    return client.indices.create({ ...index })
  }

  const updateMapping = ({ index, mapping }) => {
    return client.indices.putMapping({ index, body: mapping })
  }

  const closeIndex = index => {
    return client.indices.close({ index })
  }

  const openIndex = index => {
    return client.indices.open({ index })
  }

  const deleteIndex = index => {
    return client.indices.delete({ index })
  }

  const updateSettings = ({ index, settings }) => {
    return client.indices.putSettings({ index, body: settings })
  }

  const bulk = body => {
    return client.bulk({ refresh: true, body })
  }

  const count = index => {
    return client.count(index)
  }

  return {
    search,
    indexExists,
    createIndex,
    updateMapping,
    closeIndex,
    openIndex,
    deleteIndex,
    updateSettings,
    bulk,
    count,
  }
}

module.exports = Elasticsearch
