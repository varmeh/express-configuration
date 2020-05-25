import express from 'express'
import morgan from 'morgan'
import { winston, swagger } from './configuration'
import configureRoutes from './main.routes'

const app = express()

/* Logging Configuration */
app.use(
	morgan(
		':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
		{ stream: winston.stream }
	)
)

/* Configure Swagger */
app.use(swagger())

/* Add routes */
configureRoutes(app)

// Configure for routes that does not exist
app.use((req, res) => {
	winston.error(`${req.ip} - ${req.method} - ${req.url} - ${req.hostname}`)
	res
		.status(404)
		.json({ error: true, message: 'Could not find the route', route: res.url })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})
