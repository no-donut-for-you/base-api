
const express = require('express')
const { Op, fn, col } = require('sequelize')
const { Contract, Job, Profile, sequelize } = require('../../../models')

const router = express.Router()

/**
* @swagger
* tags:
*   name: Balances
*   description: API to deposits money into the client balance.
*/

/**
* @swagger
* /api/v1/balances/deposit/{clientId}:
*   post:
*     tags: [Balances]
*     security:
*      - basicAuth: []
*     summary: Deposit money into the client balance.
*     description: Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               amount:
*                 type: decimal
*                 description: Amount to deposit into the client balance.
*                 example: 200
*     parameters:
*       - in: header
*         name: profile_id
*         required: true
*         description: Numeric ID of the profile contract to retrieve.
*         schema:
*           type: integer
*       - in: path
*         name: clientId
*         required: true
*         description: The client id to deposit balance.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: The success deposit confirm.
*         content:
*           application/json:
*             schema:
*               properties:
*                 message:
*                   type: object
*                   description: The success message.
*                   example: Deposit successful
*       403:
*         description: When client id and profile are not matching.
*         content:
*           application/json:
*             schema:
*               properties:
*                 errors:
*                   type: object
*                   description: The error message.
*                   example: client ID and profile ID are not matching
*       400:
*         description: When amount is not provided.
*         content:
*           application/json:
*             schema:
*               properties:
*                 errors:
*                   type: object
*                   description: The error message.
*                   example: Missing amount
*/
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
