import prisma from "../lib/prisma.js";
import { generateCheckpointMaterial } from "./gemini-checkpoint.js";
import { generateAndUploadPdf } from "./pdf-service-1.js";

export const generateAndSaveCheckpoint = async (checkpointId) => { 
    try { 
        const checkpoint = await prisma.checkpoint.findUnique({ 
            where: { id: checkpointId },
            include: { learningPath: true }
        });

        if (!checkpoint) throw new Error("Checkpoint not found");
        if (checkpoint.materialContent) {
             console.log("Checkpoint already generated");
             return;
        }
    console.log("buat materi checkpoint");
    const material = await generateCheckpointMaterial({
        subject:              checkpoint.learningPath.subject,
        checkpointTitle:      checkpoint.title,
        checkpointDescription: checkpoint.description,
        orderIndex:           checkpoint.orderIndex,
        totalCheckpoints:     checkpoint.learningPath.totalCheckpoints,
        currentLevel:         checkpoint.learningPath.difficultyLevel,
        targetLevel:          checkpoint.learningPath.aiMetadata?.targetLevel,
        learningStyle:        checkpoint.learningPath.aiMetadata?.learningStyle,
        description:          checkpoint.description
    })
    console.log("materi check point selesai")
    console.log(material.materialContent)

    const pdfUrl = await generateAndUploadPdf(
        checkpointId,
        checkpoint.title,
        material.materialContent
    )

    await prisma.$connect()

await prisma.checkpoint.update({
      where: { id: checkpointId },
      data: {
        materialContent: material.materialContent,
        materialPdfUrl: pdfUrl,          
        status: 'unlocked',
        exercises: {
          create: material.exercises.map((ex, j) => ({
            question:      ex.question,
            options:       ex.options,
            correctAnswer: ex.correctAnswer,
            explanation:   ex.explanation,
            difficulty:    ex.difficulty ?? 'medium',
            orderIndex:    j,
          })),
        },
      },
    })
 
    console.log(`[Generator] Done: ${checkpoint.title} | PDF: ${pdfUrl}`)
  } catch (error) {
    console.error(`[Generator] Failed for ${checkpointId}:`, error.message)
    // Tidak throw — biar tidak crash main flow
  }
}


export const triggerNextCheckpoint = (learningPathId, currentOrderIndex) => {
  console.log(`[Generator] Triggering next checkpoint...`)
  const nextIndex = currentOrderIndex + 1
 
  // Jalankan tanpa await — background process
  prisma.checkpoint.findFirst({
    where: { learningPathId, orderIndex: nextIndex },
  }).then((next) => {
    if (next && !next.materialContent) {
      console.log(`[Generator] Background trigger: ${next.title}`)
      generateAndSaveCheckpoint(next.id) // fire and forget
    }
  }).catch(console.error)
}
