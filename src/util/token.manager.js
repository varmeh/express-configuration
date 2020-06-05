import jwt from 'jsonwebtoken'
import { winston } from './winston.logger'
import { ErrorResponse } from './error.manager'

const appToken = 'access_token'
const icmToken = 'icm_token'
const jwtExpirySeconds = process.env.NODE_ENV === 'prod' ? 300 : 300

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

export const addTokens = (res, appTokenValue, icmTokenValue) => {
	const token = {}
	token[appToken] = generateToken(appTokenValue)
	token[icmToken] = generateToken(icmTokenValue)
	res.set(token)
}

export const authenticateTokens = (req, _res, next) => {
	if (!req.get(appToken) || !req.get(icmToken)) {
		winston.error({
			status: 'error',
			msg: 'auth token missing',
			tokenStatus: {
				accessToken: !!req.get(appToken),
				icmToken: !!req.get(icmToken)
			}
		})
		throw new ErrorResponse(400, 'Bad Request')
	} else {
		// Extract payload throws errors for stale tokens
		extractPayload(appToken)
	}
	next()
}

export const getAppToken = req => getIdFromToken(req.get(appToken))
export const getIcmToken = req => getIdFromToken(req.get(icmToken))
