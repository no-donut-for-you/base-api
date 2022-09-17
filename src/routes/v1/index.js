const contracts = require('./api/contracts')
module.exports = app => {
  app.use('/api/v1/contracts', contracts)
}
