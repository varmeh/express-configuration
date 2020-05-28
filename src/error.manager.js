import { validationResult } from 'express-validator'
import { winston } from './configuration'

/* Log Error Information for the production enginer */
export const logError = (error, _req, _res, next) => {
	winston.error({ stack: error.stack })
	next(error)
}

/* Send Error Response to client */
export const sendErrorResponse = (error, _req, res, _next) => {
	const { statusCode, message, errors } = error
	res.status(statusCode).json({ errors, message, status: 'error' })
}

/* Standardized Error */
export class ErrorResponse extends Error {
	constructor(statusCode = 500, message = '', errors = []) {
		super(message)

		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name
		this.statusCode = statusCode
		this.errors = errors
	}
}

/* Validation Error Handler */
export const validationErrorHandler = (req, _res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		// We have validation error
		throw new ErrorResponse(422, 'Invalid Inputs', errors.array())
	}
	next()
}
