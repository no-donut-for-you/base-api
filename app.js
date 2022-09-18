const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const { Auth } = require('./src/middleware')
const { Logger } = require('./src/utils')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const logger = Logger.init()

const app = express()

require('./swagger')(app)

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: logger.stream,
  }))
}

app.use(bodyParser.json())
app.use(cors())

app.all('/api/v1/*', Auth.basic, Auth.getProfile)
app.all('/admin/v1/*', Auth.basic)

// routes definitions
const routes = require('./src/routes/v1')

routes(app)

// catch 404 and forward to error handler
app.use((_, res) => {
  const err = new Error('Not Found')

  logger.error(err)

  res
    .status(404)
    .json({
      message: err.message,
    })
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    logger.err(err)

    res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: err,
      })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  logger.error(err)

  res
    .status(err.status || 500)
    .json({
      message: err.message,
      error: {},
    })
})

module.exports = app
