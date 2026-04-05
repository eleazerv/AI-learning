import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getMe,updateMe,getStats } from "../controller/user.controller.js";
import { generalLimiter } from "../middleware/rateLimit.js";
const router = Router();

router.get("/me",authMiddleware,generalLimiter,getMe) ;
router.patch("/profile",authMiddleware,generalLimiter,updateMe)
router.get("/stats",authMiddleware,generalLimiter,getStats)

export default router