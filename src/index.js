const app = require('express')()

app.use((req, _, next) => {
	console.log(`${req.ip} - ${req.method} - ${req.url} - ${req.host}`)
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
app.use((_, res) => {
	res
		.status(404)
		.json({ error: true, message: 'Could not find the route', route: res.url })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})
