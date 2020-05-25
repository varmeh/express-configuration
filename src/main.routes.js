import homeRoutes from './home/home.routes'

/* Remember order matters when registering routes */
export default app => {
	const baseUrl = '/api'
	app.use(baseUrl, homeRoutes)
}
