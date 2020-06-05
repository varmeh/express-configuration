import { validationResult } from 'express-validator'

/* Send Error Response to client */
export const sendErrorResponse = (error, _req, res, _next) => {
	const { statusCode, message, errors } = error
	res.status(statusCode).json({ status: 'error', message, errors })
}

/* Standardized Error */
export class ErrorResponse extends Error {
	constructor(statusCode, message, errors = []) {
		super(message || 'Internal Server Error')

		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name
		this.statusCode = statusCode || 500
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
