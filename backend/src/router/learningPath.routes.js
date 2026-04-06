import Router from "express";
import { createLearningPath, getLearningPaths ,getLearningPathById} from "../controller/learningPath.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.use(authMiddleware); 

router.get("/", getLearningPaths);
router.get("/:id", getLearningPathById);
router.post("/buat",createLearningPath);

export default router