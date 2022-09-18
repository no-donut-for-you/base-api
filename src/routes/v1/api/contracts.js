const express = require('express')
const { Op } = require('sequelize')
const { Contract, Profile, Job } = require('../../../models')

const router = express.Router()

const contractAttributes = [
  'id',
  'clientId',
  'contractorId',
  'terms',
  'status',
]
const profileAttributes = [
  'id',
  'firstName',
  'lastName',
  'profession',
  'type',
  'balance',
]
const jobAttributes = [
  'id',
  'contractId',
  'description',
  'price',
  'paid',
  'paymentDate',
]

/**
* @swagger
* tags:
*   name: Contracts
*   description: API to get contracts between and client and a contractor. Contracts have 3 statuses, `new`, `in_progress`, `terminated`. Contracts are considered `active` only when in status `in_progress` Contracts group jobs within them.
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
*     Contract:
*       type: object
*       properties:
*         id:
*           type: integer
*           description: The contract id.
*           example: 1
*         clientId:
*           type: integer
*           description: The foreign key to client profile.
*           example: 1
*         contractorId:
*           type: integer
*           description: The foreign key to contractor profile.
*           example: 2
*         terms:
*           type: string
*           description: The terms of the contract.
*           example: Lorem ipsum dolor sit amet
*         status:
*           type: string
*           enum: [pending, accepted, rejectd, terminated, in_progress]
*           description: Thes status of the contract. The available status are 'pending', 'accepted', 'rejected', 'terminated', 'in_progress'.
*           example: in_progress
*         jobs:
*           type: array
*           job:
*             type: object
*             properties:
*               $ref: '#/components/schemas/Job'
*               contractor:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                     description: The profile id.
*                     example: 1
*                   firstName:
*                     type: string
*                     description: The first name of the contractor profile.
*                     example: Nikole
*                   lastName:
*                     type: string
*                     description: The last name of the contractor profile.
*                     example: Tesle
*                   profession:
*                     type: strong
*                     description: The contractor profile profession.
*                     example: Inventor
*                   balance:
*                     type: decimal
*                     description: The contractor profile balance.
*                     example: 10
*                   type:
*                     type: string
*                     description: The contractor profile type.
*                     example: contractor
*               client:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                     description: The profile id.
*                     example: 1
*                   firstName:
*                     type: string
*                     description: The first name of the client.
*                     example: Thomas
*                   lastName:
*                     type: string
*                     description: The last name of the client.
*                     example: Edison
*                   profession:
*                     type: strong
*                     description: The client profession.
*                     example: Thief
*                   balance:
*                     type: decimal
*                     description: client.
*                     example: 10000
*                   type:
*                     type: string
*                     description: The client type.
*                     example: client
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
    attributes: contractAttributes,
    where: {
      [Op.not]: { status: 'terminated' },
      [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
    },
    include: [
      {
        attributes: jobAttributes,
        model: Job,
        as: 'jobs',
      },
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
    attributes: contractAttributes,
    where: {
      id: req.params.id,
      [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
    },
    include: [
      {
        attributes: jobAttributes,
        model: Job,
        as: 'jobs',
      },
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
  })

  if (contract) {
    res.status(200).json({ contract })
  } else {
    res.status(404).json({ errors: ['contract not found'] })
  }
})

module.exports = router
