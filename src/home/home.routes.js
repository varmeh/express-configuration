import express from 'express'

const router = express.Router()

const { getHome } = require('./home.controller')

/**
 * @swagger
 *
 * /home:
 *   get:
 *     description: Home message
 *     produces: application/json
 *     responses:
 *       200:
 *         description: message
 *         schema:
 *           type: object
 */
router.get('/home', getHome)

export default router
