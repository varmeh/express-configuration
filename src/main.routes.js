import { homeRouter } from './api'

/* Remember order matters when registering routes */
export default app => {
	const baseUrl = '/api'
	app.use(baseUrl, homeRouter)
}
