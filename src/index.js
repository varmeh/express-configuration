const express = require('express')
const morgan = require('morgan')
const createLogger = require('./winston-logger')

const app = express()

// Logging Configuration
const winston = createLogger('main-app')
app.use(
	morgan(
		':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
		{ stream: winston.stream }
	)
)

app.get('/', (_, res) =>
	res.json({ page: 'Home', message: 'Welcome to home page' })
)

app.get('/users', (_, res) =>
	res.json({
		page: 'User',
		message: 'You are now on users page'
	})
)

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
