import { Router } from 'express'
var router = Router()

import { getItems } from '../controllers/homepage'

/* GET home page. */
router.get('/getitems/:keyword', getItems)

export default router