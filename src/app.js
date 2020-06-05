import express from 'express'
import { errorLogger, responseLogger, sendErrorResponse } from './util'
import configureDocs from './docs'

import configureRoutes from './main.routes'
import { configureApp } from './configuration'

const app = express()

/* Logging Configuration */
configureApp(app)

/* Configure Logger */
app.use(responseLogger)

/* Configure Middlewares */
app.post('/*', express.json())

/* Configure Swagger */
configureDocs(app)

/* Add routes */
configureRoutes(app)

/* Central Error Handling - Should be done before starting listener */
app.use(errorLogger)
app.use(sendErrorResponse)

export default app
