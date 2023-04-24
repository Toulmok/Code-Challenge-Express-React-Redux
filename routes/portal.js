import { Router } from "express"
import { getUser, getItems, getTags, updateTags } from "../controllers/portal.js"
const router = Router()

router.get("/getUser", getUser)
router.post("/getItems", getItems)
router.get("/getTags", getTags)
router.post("/updateTags", updateTags)

export default router