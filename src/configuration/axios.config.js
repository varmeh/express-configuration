import axios from 'axios'
import { createWinstonLogger } from '../util'

const logger = createWinstonLogger('axios')

axios.defaults.baseURL = process.env.ICM_URL || 'http://testUrl/api'
axios.defaults.headers.common['Content-Type'] = 'application/json'

logger.debug({ msg: 'config', config: axios.defaults })

const logAxiosResponseError = (error, info) => {
	const {
		message,
		stack,
		config: { url, method, data }
	} = error

	logger.error({
		loggedAt: 'axios response interceptor',
		status: 'error',
		method,
		msg: message,
		info,
		url,
		data,
		stack
	})
}

axios.interceptors.request.use(
	config => {
		const { method, data, headers, url } = config
		logger.info({
			loggedAt: 'axios request interceptor',
			status: 'success',
			method,
			url,
			data,
			headers
		})
		return config
	},
	error => {
		logger.error({
			loggedAt: 'axios request interceptor',
			status: 'error',
			error
		})
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	response => {
		const {
			config: { url, headers },
			data,
			status
		} = response
		logger.info({
			loggedAt: 'axios response interceptor',
			status: 'success',
			statusCode: status,
			url,
			data,
			headers
		})
		return response
	},
	error => {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			const {
				status,
				statusText,
				config: { url, method },
				data
			} = error.response

			logger.error({
				loggedAt: 'axios response interceptor',
				status: 'error',
				statusCode: status,
				statusText,
				method,
				msg: error.message,
				url,
				data
			})

			return Promise.reject(error.response)
		} else if (error.request) {
			// The request was made but no response was received
			logAxiosResponseError(error, 'No response received for axios request')

			// Hiding system error message
			error.status = 503
			error.message = 'Service Unavailable'
			return Promise.reject(error)
		} else {
			// Something happened in setting up the request that triggered an Error
			logAxiosResponseError(error, 'No request made by axios')

			// Hiding system error message
			error.status = 503
			error.message = 'Service Unavailable'
			return Promise.reject(error)
		}
	}
)
