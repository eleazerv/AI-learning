 import prisma from "../lib/prisma.js";
import { triggerNextCheckpoint } from "../service/checkpoint-generator.js";

 export const getCheckpointById = async(req,res)=> { 
    try { 
        const userId = req.user.id ; 
        const { id } = req.params ;
        console.log(id) ; 
        const checkpoint = await prisma.checkpoint.findUnique({ 
            where: { id: id },
            include: { 
                exercises: { orderBy: { orderIndex: "asc" } },
                learningPath: true,
                progress: { where: { userId } }
            }
        })
    if (!checkpoint) {
      return res.status(404).json({ message: "Checkpoint not found" });
    }
    if ( checkpoint.status === "locked"){ 
        return res.status(403).json({ message: "Checkpoint locked" });
    }
    if (!checkpoint.materialContent){ 
        triggerNextCheckpoint(checkpoint.learningPathId, checkpoint.orderIndex)

        return res.status(202).json ({
            message: "Checkpoint material not generated yet",
            ready: false,
        })
    }

    await prisma.checkpointProgress.upsert({
      where: { userId_checkpointId: { userId, checkpointId: id } },
      create: { userId, checkpointId: id, status: 'in_progress' },
      update: {},
    })

 
    return res.status(200).json({ data: { ...checkpoint, ready: true } })
  } catch (error) {
    console.error('[Get Checkpoint]', error.message)
    return res.status(500).json({ message: 'Internal server error',})
    }
}

export const markPdfRead = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params // checkpointId
 
    const progress = await prisma.checkpointProgress.upsert({
      where: { userId_checkpointId: { userId, checkpointId: id } },
      create: { userId, checkpointId: id, pdfRead: true },
      update: { pdfRead: true },
    })
 
    // Cek apakah kedua komponen sudah selesai
    if (progress.pdfRead && progress.exerciseDone) {
      console.log("[Mark PDF Read] checkpoint complated") ; 
      await completeCheckpoint(userId, id)
    }
 
    return res.status(200).json({
      data : { 
        checkpointProgress: progress,
        progressPercent: calculateProgress(progress)
      } 
    })

  } catch (error) {
    console.error('[Mark PDF Read]', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}


export const submitExercise = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params // checkpointId
    const { answers } = req.body // [{ exerciseId, answer }]
 
    // Ambil semua exercise checkpoint ini
    const exercises = await prisma.exercise.findMany({
      where: { checkpointId: id },
      orderBy: { orderIndex: 'asc' },
    })
 
    let correct = 0
    const results = exercises.map((ex) => {
      const userAnswer = answers.find((a) => a.exerciseId === ex.id)?.answer
      const isCorrect  = userAnswer === ex.correctAnswer
      if (isCorrect) correct++
      return { exerciseId: ex.id, isCorrect, correctAnswer: ex.correctAnswer, explanation: ex.explanation }
    })
 
    const score   = Math.round((correct / exercises.length) * 100)
    const passed  = score >= 0 // minimal 60% untuk lulus
 
    // Update progress
    const progress = await prisma.checkpointProgress.upsert({
      where: { userId_checkpointId: { userId, checkpointId: id } },
      create: { userId, checkpointId: id, score, attempts: 1, exerciseDone: passed },
      update: { score, attempts: { increment: 1 }, exerciseDone: passed },
    })
 
    // Cek apakah kedua komponen sudah selesai
    if (progress.pdfRead && progress.exerciseDone) {
      await completeCheckpoint(userId, id)
    }
 
    return res.status(200).json({
      score,
      passed,
      results,
      progressPercent: calculateProgress(progress),
    })
  } catch (error) {
    console.error('[Submit Exercise]', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
 
// Helper: hitung persentase progress 50/50
const calculateProgress = (progress) => {
  let percent = 0
  if (progress.pdfRead)     percent += 50
  if (progress.exerciseDone) percent += 50
  return percent
}
 
// Helper: complete checkpoint → unlock next → tambah XP
const completeCheckpoint = async (userId, checkpointId) => {

  const checkpoint = await prisma.checkpoint.findUnique({
    where: { id: checkpointId },
    include: { learningPath: true },
  })
// create checkpoint 
  triggerNextCheckpoint(checkpoint.learningPathId, checkpoint.orderIndex)
  // 1. Mark checkpoint sebagai selesai
  await prisma.checkpointProgress.update({
    where: { userId_checkpointId: { userId, checkpointId } },
    data: { status: 'done', completedAt: new Date() },
  })
 
  // 2. Unlock checkpoint berikutnya
  const nextCheckpoint = await prisma.checkpoint.findFirst({
    where: { learningPathId: checkpoint.learningPathId, orderIndex: checkpoint.orderIndex + 1 },
  })
  if (nextCheckpoint) {
    await prisma.checkpoint.update({
      where: { id: nextCheckpoint.id },
      data: { status: 'unlocked' },
    })
  }
 
  // 3. Tambah XP ke user
  await prisma.user.update({
    where: { id: userId },
    data: { totalXp: { increment: checkpoint.xpReward } },
  })
 
  // 4. Update currentCheckpoint di LearningPath
  await prisma.learningPath.update({
    where: { id: checkpoint.learningPathId },
    data: { currentCheckpoint: { increment: 1 } },
  })
}

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params // checkpointId
    const progress = await prisma.checkpointProgress.findUnique({
      where: { userId_checkpointId: { userId, checkpointId: id } },
    })
 
    return res.status(200).json({
      data: progress,
      progressPercent: calculateProgress(progress),
    })
  } catch (error) {
    console.error('[Get Progress]', error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
}