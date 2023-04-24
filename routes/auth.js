import { Router } from 'express'
const router = Router()
import { authorize, authenticate, refresh, signOut } from '../controllers/auth.js'

router.get('/authorize',authorize) //callback
router.get('/authenticate',authenticate) //signIn
router.get('/refresh',refresh)
router.get('/signOut',signOut)

export default router