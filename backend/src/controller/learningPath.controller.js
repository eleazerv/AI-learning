import prisma from "../lib/prisma.js";
import { generateAndSaveCheckpoint } from "../service/checkpoint-generator.js";
import { generateLearningPath } from "../service/gemini.js";
import 'dotenv/config'
export const getLearningPaths = async (req,res) => {
    try {
        const userId = req.user.id; 
        console.log(userId)
        const learningPaths = await prisma.learningPath.findMany({
           where : {userId : userId},
           select : { 
                id : true,
                subject : true, 
                description: true, 
                totalCheckpoints : true, 
                currentCheckpoint:true, 
                createdAt : true, 
           },
           orderBy : {createdAt : "desc"}
        })

        if (learningPaths.length === 0) {
            return res.status(404).json({ message: "Learning Paths not found" });
        }

        return res.status(200).json({
            data : learningPaths,
            message : "Learning Paths found",
            count: learningPaths.length,
        });
    } catch (error) {
        console.error("[Get Learning Paths] error", error);
        return res.status(500).json({ message: " Internal server error" });
    }
};

export const getLearningPathById = async (req,res) => {
    try {
        const { id } = req.params ; 
        const userId = req.user.id;
        
        const learningPath = await prisma.learningPath.findUnique({
            where : {id}, 
            include : {
                checkpoints : { 
                    orderBy: {orderIndex: "asc"},
                    include: { 
                       exercises: { orderBy : { orderIndex : "asc"}},
                       progress: { 
                        where : {userId : userId}
                       }
                    }
                }
            }
        })

        if (!learningPath) {
            return res.status(404).json({ message: "Learning Path not found" });
        }
        if (learningPath.userId !== userId) {
            return res.status(404).json({ message: "Learning Path not found" });
        }

        return res.status(200).json({
            data : learningPath 
        });
        
    } catch (error) {
        console.error("[Get Learning Path] error", error);
        return res.status(500).json({ message: " Internal server error" });
    }
}



export const createLearningPath = async (req, res) => {
   try { 
    const userId = req.user.id ; 
    const { subject, currentLevel , targetLevel , learningStyle, requestUser} = req.body ; 
    if ( !subject || !currentLevel || !targetLevel || !learningStyle || !requestUser ) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("generate outline") ; 
    const outline = await generateLearningPath({subject, currentLevel, targetLevel, learningStyle: learningStyle || "reading", requestUser: requestUser || '-'});
    console.log("generate outline done") ; 
    
     if (!outline || !outline.checkpoints || outline.checkpoints.length === 0) {
        return res.status(500).json({ 
            success: false,
            message: "AI failed to generate valid outline",
            debug: { outline } 
        });
    }
    
    await prisma.$connect()

    const learningPath = await prisma.learningPath.create({
        data: {
            userId,
            subject,
            difficultyLevel: outline.difficultyLevel,
            totalCheckpoints: outline.checkpoints.length,
            aiMetadata : { 
                currentLevel,
                targetLevel,
                learningStyle,
                estimatedWeeks: outline.estimatedWeeks,

            }

        }
    })

    const firstCheckpoint = await prisma.checkpoint.update({
        where : {id : learningPath.checkpoints[0].id},
        data : {status : "unlocked"} 
    })

    const createdCheckpoints = []
    for ( const [i,cp] of outline.checkpoints.entries()){ 
        const checkpoint = await prisma.checkpoint.create({
            data: {
                learningPathId: learningPath.id,
                title: cp.title,
                description: cp.description,
                orderIndex: i,
                xpReward: cp.xpReward
            }
        })
        createdCheckpoints.push(checkpoint)
    }


    
    console.log(" Outline generated successfully!", {
        estimatedWeeks: outline.estimatedWeeks,
        totalCheckpoints: outline.checkpoints.length
    });

    const result = await prisma.learningPath.findUnique({
        where: { id : learningPath.id},
        include : { checkpoints: { orderBy: { orderIndex: "asc" } } }
    })

    res.status(201).json({ data: result })
    console.log("trigger checkpoint")
    generateAndSaveCheckpoint(createdCheckpoints[0].id).catch(console.error)
    console.log("trigger checkpoint done")

    }catch (error) {
        console.error("[Create Learning Path] error", error);
        return res.status(500).json({ message: " Internal server error" });
    }
  
}

