const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const swaggerOptions = require('./swaggerOptions')

const setup = app =>
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsDoc(swaggerOptions), { explorer: true })
  )

module.exports = setup
