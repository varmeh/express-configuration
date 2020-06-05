import { Router } from 'express'
import { authenticateToken } from '../../util'

import { users } from './admin.controller'

const router = Router()

router.get('/users', authenticateToken, users)

export default router
