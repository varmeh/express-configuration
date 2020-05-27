import path from 'path'
import { Router } from 'express'

export default () => {
	const router = Router()

	router.get('/swagger.json', (_, res) => {
		res.sendFile(path.join(__dirname, 'swagger.json'))
	})

	router.get('/redoc', (_req, res) => {
		res.sendFile(path.join(__dirname, 'redoc.html'))
	})

	return router
}
