
const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const { Logger } = require('../utils')

const env = process.env.NODE_ENV || 'development'
const config = require('../db/config.json')[env]

const db = {}
const basename = path.basename(module.filename)
const logger = Logger.init()

const options = {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: config.operatorsAliases,
  define: config.define,
  logging: log => logger.debug(log),
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  options
)

fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)

  db[model.name] = model
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
