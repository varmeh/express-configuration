import { body } from 'express-validator'

const emailValidation = () => body('email').trim().isEmail().normalizeEmail()
const passwordValidation = () =>
	body('password')
		.trim()
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'i')

export const signupValidator = [emailValidation(), passwordValidation()]

export const signinValidator = [emailValidation(), passwordValidation()]
