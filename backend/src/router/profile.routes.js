import { Router } from "express";
import { getProfile } from "../controller/profile.controller.js";
const router = Router();

router.get("/:userId", getProfile); 

export default router