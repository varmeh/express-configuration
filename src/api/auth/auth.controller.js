import { ErrorResponse, addToken, winston } from '../../util'
import usersDb from '../../users.db'

export const userSignup = (req, res) => {
	const { email, password } = req.body

	if (usersDb[email]) {
		throw new ErrorResponse(409, 'User with credentials already exist')
	} else {
		usersDb[email] = password
		winston.debug({ msg: 'users db', users: usersDb })
		addToken(res, email)
		res.json({ status: 'success', message: 'new user created', user: email })
	}
}

export const userSignin = (req, res) => {
	const { email, password } = req.body
	console.log(email, password, usersDb[email])
	if (usersDb[email] === password) {
		addToken(res, email)
		res.json({ status: 'success' })
	} else {
		throw new ErrorResponse(401, 'Invalid Credentials')
	}
}

export const userSignout = (_req, res) => {
	res.json({ status: 'success' })
}
