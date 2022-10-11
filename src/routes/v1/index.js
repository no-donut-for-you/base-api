const cars = require('./api/cars')

module.exports = app => {
  app.use('/api/v1/cars', cars)
}
