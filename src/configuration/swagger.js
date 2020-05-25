import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Router } from 'express'

/* Configure Swagger for non-production environment */

export default () => {
	const swaggerDefinition = {
		openapi: '3.0.3',
		info: {
			title: 'Test API',
			version: '1.0.0',
			contact: {
				name: 'Support',
				email: 'dev@test.com'
			}
		},
		basePath: '/api'
	}

	const swaggerOptions = {
		swaggerDefinition,
		apis: ['**/*.routes.js']
	}

	const router = Router()
	const swaggerDocs = swaggerJSDoc(swaggerOptions)
	const swaggerUrl = '/api/docs'

	router.use(swaggerUrl, swaggerUi.serve)
	router.get(swaggerUrl, swaggerUi.setup(swaggerDocs))
	router.get(`${swaggerUrl}/configuration`, (_, res) => {
		res.status(200).json(swaggerDocs)
	})

	return router
}
