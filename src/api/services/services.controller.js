import { addToken, getToken } from '../../util'

export const refreshToken = (req, res) => {
	const token = getToken(req)
	addToken(res, token)
	res.json({ status: 'success' })
}
