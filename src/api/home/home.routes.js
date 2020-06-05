import express from 'express'

const router = express.Router()

const { helloWorld } = require('./home.controller')

router.get('/hello', helloWorld)

export default router
