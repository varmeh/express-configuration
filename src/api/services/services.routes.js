import { Router } from 'express'
import { authenticateToken } from '../../util'
import { refreshToken } from './services.controller'

const router = Router()

router.post('/refresh', authenticateToken, refreshToken)

export default router
