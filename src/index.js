const app = require('express')()
const createLogger = require('./logger')

const logger = createLogger('main-app')

app.use((req, _, next) => {
	logger.info(`${req.ip} - ${req.method} - ${req.url} - ${req.hostname}`)
	next()
})

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
	logger.error(`${req.ip} - ${req.method} - ${req.url} - ${req.hostname}`)
	res
		.status(404)
		.json({ error: true, message: 'Could not find the route', route: res.url })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})
