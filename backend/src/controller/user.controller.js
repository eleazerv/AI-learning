import prisma from "../lib/prisma.js"

export const getMe = async (req , res ) => {
    try {
        const userId = req.user.id ; 
        const user = await prisma.user.findUnique({
            where : {id : userId},
            select : { 
                name:true,
                email:true,
                avatarUrl:true,
                goal:true,
                totalXp:true,
                currentStreak:true,
                longestStreak:true,
                level:true
            }
        })

        if (!user) {
             return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({data : user});
    } catch (error) {
       console.error("[Get Me] error", error);
       return  res.status(500).json({ message: "getMe server error" });
    }
}
export const updateMe = async (req , res) => {
    try { 
        const userId = req.user.id ; 
        const { name , avatarUrl , goal , level } = req.body ;
        const user = await prisma.user.update({
            where : {id : userId},
            data : { 
                ...(name && {name}),
                ...(level && {level}),
                ...(avatarUrl && {avatarUrl}),
                ...(goal && {goal}),
            },
            select : { 
                name:true,
                email:true,
                avatarUrl:true,
                goal:true,
                totalXp:true,
                currentStreak:true,
                longestStreak:true,
                level:true
            }
        })

        return res.status(200).json({data : user});
    } catch (error) {
       console.error("[Update Me] error", error);
       return  res.status(500).json({ message: " updateMe Internal server error" });
    }
}

export const getStats = async (req , res) => {
    try {
        const userId = req.user.id ;
        const stats =  await prisma.user.findUnique({
            where :{ id: userId },
            select : {
                totalXp : true,
                currentStreak : true ,
                longestStreak:true , 
                level : true 
            }
        })
        return res.status(200).json({data: stats})
    } catch (error) {
        console.error("[Get Stats] error", error.message);
        return  res.status(500).json({ message: " getStats Internal server error", error });   }
}

