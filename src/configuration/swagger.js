import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Router } from 'express'

/* Configure Swagger for non-production environment */

export default () => {
	const swaggerOptions = {
		swaggerDefinition: {
			// openapi: '3.0.3',
			info: {
				title: 'Test API',
				version: '1.0.0',
				contact: {
					name: 'Support',
					email: 'dev@test.com'
				}
			},
			basePath: '/api'
		},
		apis: ['**/*.routes.js']
	}

	const router = Router()
	const swaggerDocs = swaggerJSDoc(swaggerOptions)
	const swaggerUrl = '/api/docs'
	const swaggerUiOptions = {
		customSiteTitle: 'Stockal Cash Mangement SwaggerUI',
		customCss: '.swagger-ui .topbar { display: none }' // hide swagger header
	}

	router.use(swaggerUrl, swaggerUi.serve)
	router.get(swaggerUrl, swaggerUi.setup(swaggerDocs, swaggerUiOptions))
	router.get(`${swaggerUrl}/configuration`, (_, res) => {
		res.status(200).json(swaggerDocs)
	})

	return router
}
