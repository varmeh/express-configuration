import { validationResult } from 'express-validator'
import { winston } from './winston.logger'

/* Send Error Response to client */
export const sendErrorResponse = (error, _req, res, _next) => {
	const { status, message, errors } = error
	res.status(status).json({ message, errors })
}

/* Standardized Error */
class ValidationError extends Error {
	constructor(status, message, errors = []) {
		super(message || 'Internal Server Error')

		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name
		this.status = status || 500
		this.errors = errors

		winston.debug({ src: 'error.manager', msg: 'validation errors', errors })
	}
}

/* Validation Error Handler */
export const validationErrorHandler = (req, _res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		// We have validation error
		throw new ValidationError(422, 'Invalid Inputs', errors.array())
	}
	next()
}
