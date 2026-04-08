import prisma from "../lib/prisma.js"
import { getStartOfWeek } from "../service/xpUpdate.js";


export const getWeekly = async (req, res) => {
   try{ 
    console.log('periodStart',getStartOfWeek(new Date()))
    const data = await prisma.leaderboardEntry.findMany({
        where: {
            periodType: "weekly",
            periodStart: getStartOfWeek(new Date()),
        },
        include : { user : true },
        orderBy: {
            xpGained: "desc",
        },
    });
        console.log('leaderboard',data)
        if (data.length === 0) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }
    return res.status(200).json({ data });

    }catch (error) {
        console.error("[Get Weekly Leaderboard] error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllTime = async (req, res) => {
    try {
        const data = await prisma.user.findMany({
            orderBy : { totalXp : "desc" },
            take : 50, 
            select : { 
                id: true, 
                name: true,
                avatarUrl:true, 
                totalXp: true,
                level: true,
            }
        })
        if(data.length === 0) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }
        return res.status(200).json({ data });
    } catch (error) {
        console.error("[Get All Time Leaderboard] error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyRank = async (req, res) => {
    try {
    const userId = req.user.id;
    const periodStart = getStartOfWeek(new Date());
    const [weeklyEntry, allTimeUsers] = await Promise.all([
    prisma.leaderboardEntry.findMany({
      where: { periodType: "weekly", periodStart },
      orderBy: { xpGained: "desc" }
    }),

    prisma.user.findMany({
      orderBy: { totalXp: "desc" },
      select: { id: true, totalXp: true }
    })
    ]);

    const weeklyRank = weeklyEntry.findIndex(e => e.userId === userId) + 1
    const weeklyXp = weeklyEntry.find(e => e.userId === userId)?.xpGained ?? 0

    const allTimeRank = allTimeUsers.findIndex(u => u.id === userId) + 1
    const allTimeXp = allTimeUsers.find(u => u.id === userId)?.totalXp ?? 0


    return res.status(200).json({
        weekly: { rank: weeklyRank, xpGained: weeklyXp },
        allTime: { rank: allTimeRank, xpGained: allTimeXp }
    })

    } catch (error) {
        console.error("[Get My Rank] error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
