const express = require('express')
const { Op } = require('sequelize')

const { Contract, Job, Profile, sequelize } = require('../../../models')

const router = express.Router()

const attributes = [
  'id',
  'contractId',
  'description',
  'price',
  'paid',
  'paymentDate'
]

/* GET /jobs/unpaid */
router.get('/unpaid', async (req, res) => {
  const profileId = req.get('profile_id')

  const jobs = await Job.findAll({
    attributes,
    where: {
      paid: false,
    },
    include: {
      model: Contract,
      as: 'contract',
      attributes: [],
      where: {
        status: 'in_progress',
        [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
      },
    },
  })

  res.status(200).json({ jobs })
})

/* POST /jobs/:id/pay */
router.post('/:id/pay', async (req, res) => {
  const profileId = req.get('profile_id')
  const jobId = req.params.id

  const profileAttributes = ['id', 'firstName', 'lastName', 'profession', 'type', 'balance']

  const job = await Job.findOne({
    attributes,
    where: {
      id: jobId,
      paid: false,
    },
    include: {
      model: Contract,
      as: 'contract',
      attributes: ['id', 'clientId', 'contractorId', 'terms', 'status'],
      where: {
        status: 'in_progress',
        clientId: profileId,
      },
      include: [
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'client',
        },
        {
          attributes: profileAttributes,
          model: Profile,
          as: 'contractor',
        },
      ],
    },
  })

  if (!job) {
    return res.status(404).json({ error: 'Job not found' })
  }

  const { price, contract: { client, contractor } } = job

  if (client.balance < price) {
    return res
      .status(403)
      .json({ error: `Client ${client.id} has insufficient funds` })
  }

  const transaction = await sequelize.transaction()

  try {
    await contractor.increment('balance', { by: price, transaction })
    await client.decrement('balance', { by: price, transaction })
    await job.update({ paid: true, paymentDate: new Date() }, { transaction })

    await transaction.commit()

    await job.reload()

    return res.status(200).json({ job })
  } catch (err) {
    await transaction.rollback()

    return res.status(403).json({ error: err.message })
  }
})

module.exports = router
