// Return a random 8 digit string
const randomString = () => Math.random().toString(36).substr(2, 8)

export const generateApplicationNumber = () =>
	`${randomString()}${randomString()}`.toUpperCase()
