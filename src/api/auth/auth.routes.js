import { Router } from 'express'
import { authenticateToken, validationErrorHandler } from '../../util'

import { signinValidator, signupValidator } from './auth.validator'
import { userSignin, userSignout, userSignup } from './auth.controller'

const router = Router()

router.post('/signup', signupValidator, validationErrorHandler, userSignup)

router.post('/signin', signinValidator, validationErrorHandler, userSignin)

router.post('/signout', authenticateToken, userSignout)

export default router
