/*
  Index custom normalizer:
  Index normalizer specifies the normalizer used for text analysis when indexing or searching a text field.
  See: https://www.elastic.co/guide/en/elasticsearch/reference/current/normalizer.html
*/

const settings = {
  analysis: {
    normalizer: {
      default_normalizer: {
        type: 'custom',
        filter: ['lowercase', 'trim'],
      },
    },
  },
}

module.exports = settings
