import axios from 'axios'
import { createWinstonLogger } from '../util'

const logger = createWinstonLogger('axios')

axios.defaults.baseURL = process.env.ICM_URL || 'http://testUrl/api'

axios.defaults.headers.common['Content-Type'] = 'application/json'

logger.debug({ msg: 'config', config: axios.defaults })

axios.interceptors.request.use(
	config => {
		logger.info({
			msg: 'request',
			status: 'success',
			method: config.method,
			url: config.url,
			data: config.data,
			headers: config.headers
		})
		return config
	},
	error => {
		logger.error({ msg: 'request', status: 'error', error })
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	response => {
		logger.info({
			msg: 'response',
			status: 'success',
			statusCode: response.status,
			url: response.config.url,
			data: response.data,
			headers: response.headers
		})
		return response
	},
	error => {
		const { status, statusText, config, data } = error.response
		logger.error({
			status: 'error',
			statusCode: status,
			method: config.method,
			msg: statusText,
			url: config.url,
			data
		})
		return Promise.reject(error.response)
	}
)
