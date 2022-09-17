const express = require('express')
const { Op } = require('sequelize')
const { Contract } = require('../../../models')

const router = express.Router()

const attributes = ['id', 'clientId', 'contractorId', 'terms', 'status']

/* GET /contracts */
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

/* GET /contracts/:id */
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
