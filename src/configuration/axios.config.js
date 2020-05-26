import axios from 'axios'
import { createWinstonLogger } from './winston-logger'

const logger = createWinstonLogger('axios')

axios.defaults.baseURL = process.env.ICM_URL || 'http://testUrl/api'

logger.debug(axios.defaults)

axios.interceptors.request.use(
	config => {
		logger.info({
			msg: 'axios request',
			status: 'success',
			method: config.method,
			url: config.url,
			headers: config.headers
		})
		return config
	},
	error => {
		logger.error({ msg: 'axios request', status: 'error', error })
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	response => {
		logger.info({
			msg: 'axios response',
			status: 'success',
			statusCode: response.status,
			url: response.config.url,
			data: response.data
		})
		return response
	},
	error => {
		logger.error({ msg: 'axios response', status: 'error', error })
		return Promise.reject(error)
	}
)
