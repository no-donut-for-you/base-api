const contracts = require('./api/contracts')
const jobs = require('./api/jobs')
const balances = require('./api/balances')

const adminProfiles = require('./admin/profiles')

module.exports = app => {
  app.use('/api/v1/contracts', contracts)
  app.use('/api/v1/jobs', jobs)
  app.use('/api/v1/balances', balances)

  app.use('/admin/v1', adminProfiles)
}
