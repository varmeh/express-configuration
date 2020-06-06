import express from 'express'
import rTracer from 'cls-rtracer'

import {
	errorLogger,
	requestLogger,
	responseLogger,
	sendErrorResponse
} from './util'
import configureDocs from './docs'

import configureRoutes from './main.routes'
import { configureApp } from './configuration'

const app = express()

/* Configuration */
configureApp(app)

/* Configure Middlewares */
app.use(rTracer.expressMiddleware())
app.post('/*', express.json())

/* Configure Logger */
app.use(requestLogger)
app.use(responseLogger)

/* Configure Swagger */
configureDocs(app)

/* Add routes */
configureRoutes(app)

/* Central Error Handling - Should be done before starting listener */
app.use(errorLogger)
app.use(sendErrorResponse)

export default app
