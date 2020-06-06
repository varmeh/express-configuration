import jwt from 'jsonwebtoken'
import { BadRequest, Unauthorized } from 'http-errors'
import { winston } from './winston.logger'

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
			throw new Unauthorized('Unauhorized - Invalid Tokens')
		}
		// otherwise, return a bad request error
		throw new BadRequest('Bad Request - Invalid Token')
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
	if (req.get(appToken)) {
		// Extract payload throws errors for stale tokens
		extractPayload(req.get(appToken))
	} else {
		winston.error({
			status: 'error',
			msg: 'auth token missing'
		})
		throw new BadRequest('Bad Request - no authorization token')
	}
	next()
}

export const getToken = req => getIdFromToken(req.get(appToken))
