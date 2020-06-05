export const helloWorld = (_, res) => {
	res.status(200).json({ message: 'Hello World' })
}
