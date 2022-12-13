const basicAuth = require('basic-auth')
const auth = require('../../src/middleware/auth')

jest.mock('basic-auth')

describe('Auth', () => {
  describe('basic', () => {
    it('should return 401 if basic auth is not provided', () => {
      const req = { headers: {} }

      const res = {
        set: jest.fn().mockReturnThis(),
        sendStatus: jest.fn(),
      }

      const next = jest.fn()

      auth.basic(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.set).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm=Authorization Required')
      expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('should return 401 if basic auth is not correct', () => {
      process.env.BASIC_AUTH_USERNAME = 'fake'
      process.env.BASIC_AUTH_PASSWORD = 'not-fake'

      basicAuth.mockReturnValueOnce({ name: 'fake', pass: 'fake' })

      const req = { headers: {} }

      const res = {
        set: jest.fn().mockReturnThis(),
        sendStatus: jest.fn(),
      }

      const next = jest.fn()

      auth.basic(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.set).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm=Authorization Required')
      expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it('should call the next callback if basic auth is correct', () => {
      process.env.BASIC_AUTH_USERNAME = 'fake'
      process.env.BASIC_AUTH_PASSWORD = 'fake'

      basicAuth.mockReturnValueOnce({ name: 'fake', pass: 'fake' })

      const req = { headers: {} }

      const res = {
        set: jest.fn().mockReturnThis(),
        sendStatus: jest.fn(),
      }

      const next = jest.fn()

      auth.basic(req, res, next)

      expect(res.set).not.toHaveBeenCalled()
      expect(res.sendStatus).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })
})
