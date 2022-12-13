const express = require('express')
const { search } = require('../../../elasticsearch/cars')

const router = express.Router()

/**
* @swagger
* tags:
*   name: Cars
*   description: API to manage cars
* components:
*   schemas:
*     Car:
*       type: object
*       properties:
*         id:
*           type: integer
*           description: The car id
*           example: 1
*         name:
*           type: string
*           description: The car name
*           example: Aston Martin DB5
*         description:
*           type: text
*           description: The car description
*           example: The Aston Martin DB5 is a British luxury grand tourer that was made by Aston Martin from 1963 to 1965. It is an iconic car, having been featured in many films and television series, including Goldfinger, Thunderball, Casino Royale, Tomorrow Never Dies, and The World Is Not Enough
*         year:
*           type: text
*           description: The car year
*           example: 1963
*         chassis:
*           type: text
*           description: The car chassis
*           example: DB5
*/

/**
* @swagger
* /api/v1/cars:
*   get:
*     tags: [Cars]
*     security:
*      - basicAuth: []
*     summary: Retrieve a list of cars
*     description: Get all cars
*     responses:
*       200:
*         description: A list of cars.
*         content:
*           application/json:
*             schema:
*               type: array
*               cars:
*                 $ref: '#/components/schemas/Car'
*/
router.get('/', async (req, res) => {
  const cars = await search()

  res.status(200).json(cars)
})

module.exports = router
