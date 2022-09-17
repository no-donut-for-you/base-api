
const express = require('express')
const { Op, fn, col } = require('sequelize')
const { Contract, Job, Profile, sequelize } = require('../../../models')

const router = express.Router()

/* POST /balances/deposit/:clientId */
router.post('/deposit/:clientId', async (req, res) => {
  const profileId = req.get('profile_id')
  const clientId = req.params.clientId

  if (profileId !== clientId) {
    return res.status(403).json({ error: 'client ID and profile ID are not matching' })
  }

  const amount = req.body.amount

  if (!amount) {
    return res.status(400).json({ error: 'Missing amount' })
  }

  const profile = await Profile.findOne({
    attributes: [
      'id',
      'balance',
      'type',
      [fn('SUM', col('client_contracts.jobs.price')), 'jobsTotalPrice']
    ],
    where: {
      id: clientId,
      type: 'client'
    },
    include: {
      model: Contract,
      as: 'client_contracts',
      where: { [Op.not]: { status: 'terminated' } },
      attributes: [],
      include: {
        model: Job,
        as: 'jobs',
        where: { paid: false },
        attributes: [],
      },
    },
  })

  const { jobsTotalPrice, type } = profile.dataValues
  const maxDepositAmount = jobsTotalPrice * 0.25

  if (type !== 'client') {
    return res.status(403).json({ error: 'Only clients can make deposits' })
  }

  if (amount > maxDepositAmount) {
    return res.status(400).json({ error: 'deposit can\'t be more than 25% of total of jobs to pay' })
  }

  const transaction = await sequelize.transaction()

  try {
    await profile.increment('balance', { by: amount, transaction })

    await transaction.commit()

    return res.status(200).json({ message: 'Deposit successful' })
  } catch (err) {
    await transaction.rollback()

    return res.status(400).json({ error: err.message })
  }
})

module.exports = router
