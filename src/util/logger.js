import { winston } from './winston.logger'

/**
 * This logger logs all responses going out of express logging utility
 */
export const requestLogger = (req, _res, next) => {
	const {
		originalUrl,
		method,
		hostname,
		httpVersion,
		ip,
		protocol,
		headers,
		body,
		socket
	} = req
	const { remoteAddress, remoteFamily } = socket

	winston.info({
		loggedAt: 'requestLogger',
		url: originalUrl,
		method,
		hostname,
		httpVersion,
		ip,
		protocol,
		remoteAddress,
		remoteFamily,
		req: {
			headers,
			body
		}
	})
	next()
}

/**
 * This logger logs all responses going out of express logging utility
 */
export const responseLogger = (req, res, next) => {
	const requestStart = Date.now()

	res.on('finish', () => {
		const { originalUrl, method, hostname } = req

		const { statusCode, statusMessage } = res
		const headers = res.getHeaders()

		winston.info({
			loggedAt: 'responseLogger',
			url: originalUrl,
			method,
			hostname,
			response: {
				statusCode,
				statusMessage,
				processingTime: Date.now() - requestStart,
				headers
			}
		})
	})
	next()
}

/* Log Error Information for the production enginer */
export const errorLogger = (error, req, _res, next) => {
	const { originalUrl, method, hostname, ip, protocol } = req
	winston.error({
		loggedAt: 'errorLogger',
		url: originalUrl,
		method,
		ip,
		hostname,
		protocol,
		status: error.status || error.statusCode || 500,
		text: error.message,
		stack: error.stack
	})
	next(error)
}
