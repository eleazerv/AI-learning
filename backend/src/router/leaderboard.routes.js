import Router from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { getWeekly,getAllTime,getMyRank } from "../controller/leaderboard.controller.js"
const router = Router(); 

    router.use(authMiddleware)
    router.get("/weekly",getWeekly) ; 
    router.get("/all-time",getAllTime) ; 
    router.get("/me",getMyRank)

export default router