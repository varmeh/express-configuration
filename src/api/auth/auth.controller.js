import { Conflict, Unauthorized } from 'http-errors'
import { addToken, winston } from '../../util'
import usersDb from '../../users.db'

export const userSignup = (req, res) => {
	const { email, password } = req.body

	if (usersDb[email]) {
		throw new Conflict('User with credentials already exist')
	} else {
		usersDb[email] = password
		winston.debug({ msg: 'users db', users: usersDb })
		addToken(res, email)
		res.json({ status: 'success', message: 'new user created', user: email })
	}
}

export const userSignin = (req, res) => {
	const { email, password } = req.body
	if (usersDb[email] === password) {
		addToken(res, email)
		res.json({ status: 'success' })
	} else {
		throw new Unauthorized('Invalid Credentials')
	}
}

export const userSignout = (_req, res) => {
	res.json({ status: 'success' })
}
