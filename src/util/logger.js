import { v4 as uuidv4 } from 'uuid'
import { createWinstonLogger } from './winston.logger'

const logger = createWinstonLogger('api-logs')

/**
 * This logger logs all responses going out of express logging utility
 */
export const requestLogger = (req, res, next) => {
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

	// Generate tracking id for request
	const id = uuidv4()
	res.locals.id = id

	logger.info({
		id,
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

		const { id } = res.locals

		logger.info({
			id,
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
export const errorLogger = (error, req, res, next) => {
	const { originalUrl, method, hostname, ip, protocol } = req
	const { id } = res.locals
	logger.error({
		id,
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
