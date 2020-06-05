import jwt from 'jsonwebtoken'
import { winston } from './winston.logger'
import { ErrorResponse } from './error.manager'

const appToken = 'access_token'
const jwtExpirySeconds = process.env.NODE_ENV === 'prod' ? 300 : 300
const secretKey =
	process.env.NODE_ENV === 'prod'
		? process.env.JWT_SECRET
		: 'test_secret_key_for_jwt'

const generateToken = id =>
	jwt.sign({ id }, secretKey, {
		algorithm: 'HS256',
		expiresIn: jwtExpirySeconds
	})

const extractPayload = token => {
	try {
		return jwt.verify(token, secretKey)
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			throw new ErrorResponse(401, 'Unauthorized User')
		}
		// otherwise, return a bad request error
		throw new ErrorResponse(400, 'Bad Request')
	}
}

const getIdFromToken = token => {
	const payload = extractPayload(token)
	if (payload && payload.id) {
		return payload.id
	}
	return null
}

export const addToken = (res, appTokenValue) => {
	const token = {}
	token[appToken] = generateToken(appTokenValue)
	res.set(token)
}

export const authenticateToken = (req, _res, next) => {
	console.log(req.get(appToken))
	if (req.get(appToken)) {
		// Extract payload throws errors for stale tokens
		extractPayload(req.get(appToken))
	} else {
		winston.error({
			status: 'error',
			msg: 'auth token missing'
		})
		throw new ErrorResponse(400, 'Bad Request')
	}
	next()
}

export const getToken = req => getIdFromToken(req.get(appToken))
