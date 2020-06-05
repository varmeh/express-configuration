import { getToken, winston } from '../../util'
import usersDb from '../../users.db'

// This method returns a users list for Admin user
export const users = (req, res) => {
	const email = getToken(req)
	if (email === 'admin@e.com') {
		res.json({ users: Object.keys(usersDb) })
	} else {
		winston.error({ msg: 'unauthorized user', userId: email })
		res.status(401).json({ status: 'error', message: 'Unauthorized Access' })
	}
}
