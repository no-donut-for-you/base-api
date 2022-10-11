const basicAuth = require('basic-auth')

const basic = async (req, res, next) => {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')

    return res.sendStatus(401)
  }

  const basicAuthUserName = process.env.BASIC_AUTH_USERNAME
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD

  const user = basicAuth(req)

  if (!user || !user.name || !user.pass) {
    return unauthorized(res)
  }

  if (user.name === basicAuthUserName && user.pass === basicAuthPassword) {
    return next()
  }

  return unauthorized(res)
}

module.exports = { basic }
