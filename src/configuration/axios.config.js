import axios from 'axios'
import { winston as logger } from '../util'

axios.defaults.baseURL = process.env.ICM_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

logger.debug({ msg: 'config', config: axios.defaults })

const logAxiosResponseError = (error, info) => {
	const {
		message,
		stack,
		config: { url, method, data }
	} = error

	logger.debug({
		src: 'axios response error',
		url,
		method,
		msg: message,
		info,
		data,
		stack
	})
}

axios.interceptors.request.use(
	config => {
		const { method, data, url } = config
		logger.debug({
			src: 'axios request interceptor',
			url,
			method,
			data
		})
		return config
	},
	error => {
		logger.debug({
			src: 'axios request error',
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
		logger.debug({
			src: 'axios response interceptor',
			url,
			statusCode: status,
			data
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

			logger.debug({
				src: 'axios response error',
				url,
				method,
				statusCode: status,
				statusText,
				msg: error.message,
				data
			})

			// As error.response is returned & it does not have a message key,
			// So, add one to accomodate error.response
			error.response.message = data.error.message
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
