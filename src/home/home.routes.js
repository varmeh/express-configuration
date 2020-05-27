import express from 'express'

const router = express.Router()

const { getHome } = require('./home.controller')

router.get('/home', getHome)

export default router
