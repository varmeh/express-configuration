import jwt from 'jsonwebtoken'
import { BadRequest, Unauthorized } from 'http-errors'
import { winston } from './winston.logger'

const appToken = 'access_token'
const icmToken = 'icm_token'
const jwtExpirySeconds = process.env.NODE_ENV === 'production' ? 300 : 600

const generateToken = id =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: jwtExpirySeconds
	})

const extractPayload = token => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			throw new Unauthorized('Uauthorized - Invalid Tokens')
		}
		// otherwise, return a bad request error
		throw new BadRequest('Bad Request - Invalid Tokens')
	}
}

const getIdFromToken = token => {
	const payload = extractPayload(token) // Throws error for stale token
	if (payload && payload.id) {
		return payload.id
	}
	return null
}

export const getAppToken = req => getIdFromToken(req.get(appToken))
export const getIcmToken = req => getIdFromToken(req.get(icmToken))

export const createTokens = (res, appTokenValue, icmTokenValue) => {
	const token = {}
	token[appToken] = generateToken(appTokenValue)
	token[icmToken] = generateToken(icmTokenValue)
	res.set(token)
}

export const authenticateTokens = (req, _res, next) => {
	if (!req.get(appToken) || !req.get(icmToken)) {
		winston.error({
			msg: 'auth token missing',
			tokenStatus: {
				accessToken: !!req.get(appToken),
				icmToken: !!req.get(icmToken)
			}
		})
		throw new BadRequest('Bad Request - Tokens Missing')
	} else {
		// Extract payload throws errors for stale tokens
		extractPayload(req.get(appToken))
	}
	next()
}

export const refreshTokens = (req, res, next) => {
	const token = {}
	token[appToken] = generateToken(getAppToken(req))

	// Icm token is not refreshed as it has an expiry time of 24 hrs
	token[icmToken] = req.get(icmToken)

	// Set refreshed tokens on response object
	res.set(token)
	next()
}
