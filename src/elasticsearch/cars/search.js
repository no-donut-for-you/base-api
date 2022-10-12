const Elasticsearch = require('../elasticsearch')
const { cars } = require('./index/index')

const { index: indexName } = cars
const elasticsearch = Elasticsearch()

const search = async () => {
  const query = {
    match_all: {},
  }

  const { hits: { total: { value: total }, hits: cars } } = await elasticsearch.search({ index: indexName, query })

  return { total, cars }
}

module.exports = search
