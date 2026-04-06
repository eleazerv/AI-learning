import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  getCheckpointById,
  markPdfRead,
  submitExercise,
  getProgress
} from '../controller/checkpoint.controller.js'
 
const router = Router()
router.use(authMiddleware)
 
router.get('/:id',          getCheckpointById) // ambil checkpoint + trigger next
router.post('/:id/pdf-read', markPdfRead)       // user selesai baca PDF
router.post('/:id/submit',   submitExercise) 
router.get('/:id/progress', getProgress)  
 
export default router
