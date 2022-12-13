/*
  Index mapping definition:
  Index mapping is the process of defining how a document, and the fields it contains, are stored and indexed.

  See: https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
*/

const mapping = {
  properties: {
    id: { type: 'keyword' },
    description: { type: 'text' },
    year: { type: 'integer' },
    name: {
      type: 'text',
      fields: {
        normalize: {
          type: 'keyword',
          normalizer: 'default_normalizer',
        },
      },
    },
    chassis: {
      type: 'text',
      fields: {
        normalize: {
          type: 'keyword',
          normalizer: 'default_normalizer',
        },
      },
    },
  },
}

module.exports = mapping
