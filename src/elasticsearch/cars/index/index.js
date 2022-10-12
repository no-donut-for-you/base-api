/*
  Index settings definitions:
  https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html#create-index-settings

  For more about index shards and replicas, see:
  https://www.elastic.co/blog/how-many-shards-should-i-have-in-my-elasticsearch-cluster
  https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html
*/

const numberOfShards = process.env.NUMBER_OF_SHARDS || 3
const numberOfReplicas = 0

const indexName = 'cars'

const cars = {
  index: indexName,
  body: {
    settings: {
      number_of_shards: numberOfShards,
      number_of_replicas: numberOfReplicas,
    },
  },
}

module.exports = { cars }
