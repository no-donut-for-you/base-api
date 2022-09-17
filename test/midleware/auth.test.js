const basicAuth = require('basic-auth')

const auth = require('../../src/middleware/auth')
const { Profile } = require('../../src/models')

jest.mock('basic-auth')

jest.mock('../../src/models', () => ({
  Profile: { findOne: jest.fn() }
}))

describe('Auth', () => {
  describe('getProfile', () => {
    it('should return 401 if profile_id is not provided', () => {
      const req = { get: jest.fn().mockReturnValue(null) }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      const next = jest.fn()

      auth.getProfile(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized. profile_id not provided.' })
    })

    it('should return 401 if profile is not found', async () => {
      Profile.findOne.mockReturnValueOnce(null)

      const req = { get: jest.fn().mockReturnValue('1') }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      const next = jest.fn()

      await auth.getProfile(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized. Profile not found.' })
    })

    it('should return call the next callback when profile is found', async () => {
      Profile.findOne.mockReturnValueOnce({ fake: 'fake' })

      const req = { get: jest.fn().mockReturnValue('1') }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      const next = jest.fn()

      await auth.getProfile(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()

      expect(Profile.findOne).toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

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
