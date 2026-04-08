import { Router } from "express";
import { getStreak , updateStreak } from "../controller/streak.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

    router.get('/',authMiddleware,getStreak) 
    router.post('/check-in',authMiddleware,updateStreak)

export default router