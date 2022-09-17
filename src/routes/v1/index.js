const contracts = require('./api/contracts')
const jobs = require('./api/jobs')
module.exports = app => {
  app.use('/api/v1/contracts', contracts)
  app.use('/api/v1/jobs', jobs)
}
