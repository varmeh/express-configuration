import swagger from './swagger'
import redoc from './redoc'

export default app => {
	const docsUrl = '/api/docs/'
	app.use(docsUrl, swagger())
	app.use(docsUrl, redoc())
}
