const express = require('express')
const { Op } = require('sequelize')

const { Contract, Job, Profile, sequelize } = require('../../../models')

const router = express.Router()

const jobAttributes = [
  'id',
  'contractId',
  'description',
  'price',
  'paid',
  'paymentDate'
]

const profileAttributes = [
  'id',
  'firstName',
  'lastName',
  'profession',
  'type',
  'balance',
]

const contractAttributes = [
  'id',
  'clientId',
  'contractorId',
  'terms',
  'status'
]

/**
   * @swagger
   * tags:
   *   name: Jobs
   *   description: API to get jobs.
   * components:
   *   schemas:
   *     Job:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: The contract id.
   *           example: 1
   *         contractId:
   *           type: integer
   *           description: The foreign key to contract.
   *           example: 1
   *         description:
   *           type: string
   *           description: The description of the contract.
   *           example: Lorem ipsum dolor sit amet
   *         price:
   *           type: decimal
   *           description: The price of the contract.
   *           example: 4999.99
   *         paymentDate:
   *           type: date
   *           description: The date of the payment.
   *           example: 2020-08-16T19:11:26.737Z
   *         contract:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *               description: The contract id.
   *               example: 1
   *             clientId:
   *               type: integer
   *               description: The foreign key to client.
   *               example: 1
   *             contractorId:
   *               type: integer
   *               description: The foreign key to contractor.
   *               example: 1
   *             terms:
   *               type: string
   *               description: The terms of the contract.
   *               example: Lorem ipsum dolor sit amet
   *             status:
   *               type: string
   *               description: Thes status of the contract. The status are 'pending', 'accepted', 'rejected', 'terminated'.
   *               example: in_progress
   *             contractor:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: The profile id.
   *                   example: 1
   *                 firstName:
   *                   type: string
   *                   description: The first name of the contractor profile.
   *                   example: Nikole
   *                 lastName:
   *                   type: string
   *                   description: The last name of the contractor profile.
   *                   example: Tesle
   *                 profession:
   *                   type: strong
   *                   description: The contractor profile profession.
   *                   example: Inventor
   *                 balance:
   *                   type: decimal
   *                   description: The contractor profile balance.
   *                   example: 10
   *                 type:
   *                   type: string
   *                   description: The contractor profile type.
   *                   example: contractor
   *             client:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: The profile id.
   *                   example: 1
   *                 firstName:
   *                   type: string
   *                   description: The first name of the client.
   *                   example: Thomas
   *                 lastName:
   *                   type: string
   *                   description: The last name of the client.
   *                   example: Edison
   *                 profession:
   *                   type: strong
   *                   description: The client profession.
   *                   example: Thief
   *                 balance:
   *                   type: decimal
   *                   description: client.
   *                   example: 10000
   *                 type:
   *                   type: string
   *                   description: The client type.
   *                   example: client
   */

/**
   * @swagger
   * /api/v1/jobs/unpaid:
   *   get:
   *     tags: [Jobs]
   *     security:
   *      - basicAuth: []
   *     summary: Retrieve a list of unpaind jobs.
   *     description: Returns a list of unpaind jobs.
   *     parameters:
   *       - in: header
   *         name: profile_id
   *         required: true
   *         description: Numeric ID of the profile contract to retrieve.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: A list of jobs.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               jobs:
   *                 $ref: '#/components/schemas/Job'
   */
router.get('/unpaid', async (req, res) => {
  const profileId = req.get('profile_id')

  const jobs = await Job.findAll({
    attributes: jobAttributes,
    where: {
      paid: false,
    },
    include: {
      attributes: contractAttributes,
      model: Contract,
      as: 'contract',
      where: {
        status: 'in_progress',
        [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
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

  res.status(200).json({ jobs })
})

/**
 * @swagger
 * /api/v1/jobs/{id}/pay:
 *   post:
 *     tags: [Jobs]
 *     security:
 *      - basicAuth: []
 *     summary: Pay an unpaind job.
 *     description: Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
 *     parameters:
 *       - in: header
 *         name: profile_id
 *         required: true
 *         description: The profile contract to retrieve.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: The job id to pay.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The paid job.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   type: object
 *                   $ref: '#/components/schemas/Job'
*/
router.post('/:id/pay', async (req, res) => {
  const profileId = req.get('profile_id')
  const jobId = req.params.id

  const job = await Job.findOne({
    attributes: jobAttributes,
    where: {
      id: jobId,
      paid: false,
    },
    include: {
      model: Contract,
      as: 'contract',
      attributes: contractAttributes,
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
