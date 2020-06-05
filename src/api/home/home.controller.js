export const getHome = (_, res) => {
	res.status(200).json({ message: 'Hello World' })
}
