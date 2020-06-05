import { adminRouter, authRouter, homeRouter, servicesRouter } from './api'

/* Remember order matters when registering routes */
export default app => {
	const baseUrl = '/api'
	app.use(`${baseUrl}/admin`, adminRouter)
	app.use(`${baseUrl}/auth`, authRouter)
	app.use(`${baseUrl}/home`, homeRouter)
	app.use(baseUrl, servicesRouter)
}
