
import prisma from "../lib/prisma.js";
export const getStreak = async (req, res) => {
    try {
        const userId = req.user.id 
        const data = await prisma.user.findUnique({
            where : { id : userId },
            select : {
                currentStreak : true,
                longestStreak : true,
                streakLogs : { 
                    orderBy : { 
                        logDate: "desc"
                    },
                take : 7
                }
            }
        })
    
        if (!data){
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ data : data});
    } catch (error) {
        console.error("[Get Streak] error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateStreak = async (req, res) => {
    try {
        const userId = req.user.id
        const { done } = req.body

        if ( typeof done !== "boolean") {
            return res.status(400).json({ message: "done must be a boolean" });
        }
        const today = new Date("2026-04-20"); 
        today.setUTCHours(0,0,0,0)
        const exisitingLog = await prisma.streakLog.findUnique({
            where :{userId_logDate : {userId, logDate : today}}
        })
       
        if (exisitingLog) { 
            return res.status(400).json({ message: "Streak already updated today" });
        }

        const user = await prisma.user.findUnique({
            where : {id : userId},
            select : { currentStreak : true, longestStreak : true }
        })
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdaylog = await prisma.streakLog.findUnique({
            where: {userId_logDate: {userId, logDate: yesterday}},
            select: { completedDaily: true }
        })

        const xpEarned = done ? 20 : 0 ; 
        let newStreak = 0 ; 
        if ( done ) {
            if ( yesterdaylog && yesterdaylog.completedDaily) {
                newStreak = user.currentStreak + 1;
            }else { 
                newStreak = 1;
            }
        }
        const newLongestStreak = Math.max (user.longestStreak,newStreak);


        await prisma.streakLog.create({
        data: {
            userId,
            logDate: today,
            completedDaily: done,
            xpEarned,
        },
        })

        const updateUser = await prisma.user.update({
            where : {id : userId},
            data : {
                currentStreak : newStreak,
                longestStreak : newLongestStreak,
                totalXp : {increment : xpEarned},
                lastActive : new Date()
            },
            select : {
                currentStreak : true,
                longestStreak : true,
                totalXp : true , 
            }
        })

        res.status(200).json({ data : updateUser});
    } catch (error) {
        console.error ("[Update Streak] error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}