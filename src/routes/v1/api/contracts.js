const express = require('express')
const { Op } = require('sequelize')
const { Contract } = require('../../../models')

const router = express.Router()

const attributes = ['id', 'clientId', 'contractorId', 'terms', 'status']

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: API to get contracts between and client and a contractor. Contracts have 3 statuses, `new`, `in_progress`, `terminated`. Contracts are considered `active` only when in status `in_progress` Contracts group jobs within them.
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The contract id.
 *           example: 1
 *         clientId:
 *           type: integer
 *           description: The foreign key to client.
 *           example: 1
 *         contractorId:
 *           type: integer
 *           description: The foreign key to contractor.
 *           example: 1
 *         terms:
 *           type: string
 *           description: The terms of the contract.
 *           example: Lorem ipsum dolor sit amet
 *         status:
 *           type: string
 *           description: Thes status of the contract. The status are 'pending', 'accepted', 'rejected', 'terminated'.
 *           example: in_progress
*/

/**
 * @swagger
 * /api/v1/contracts:
 *   get:
 *     tags: [Contracts]
 *     security:
 *      - basicAuth: []
 *     summary: Retrieve a list of contracts.
 *     description: Returns a list of contracts only if it belongs to the profile calling the API.
 *     parameters:
 *       - in: header
 *         name: profile_id
 *         required: true
 *         description: Numeric ID of the profile contract to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of contracts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               contracts:
 *                 $ref: '#/components/schemas/Contract'
*/
router.get('/', async (req, res) => {
  const profileId = req.get('profile_id')

  const contracts = await Contract.findAll({
    attributes,
    where: {
      [Op.not]: { status: 'terminated', },
      [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
    },
  })

  res.status(200).json({ contracts })
})

/**
 * @swagger
 * /api/v1/contracts/{id}:
 *   get:
 *     tags: [Contracts]
 *     security:
 *      - basicAuth: []
 *     summary: Retrieve a single contract.
 *     description: Returns the contract only if it belongs to the profile calling the API.
 *     parameters:
 *       - in: header
 *         name: profile_id
 *         required: true
 *         description: Numeric ID of the profile contract to retrieve.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the contract to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single contract.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contract:
 *                   type: object
 *                   $ref: '#/components/schemas/Contract'
 *       404:
 *         description: When a contract is not found.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: The error message.
 *                   example: ['contract not found']
*/
router.get('/:id', async (req, res) => {
  const profileId = req.get('profile_id')

  const contract = await Contract.findOne({
    attributes,
    where: {
      id: req.params.id,
      [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
    },
  })

  if (contract) {
    res.status(200).json({ contract })
  } else {
    res.status(404).json({ errors: ['contract not found'] })
  }
})

module.exports = router
