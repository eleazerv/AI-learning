import prisma from "../lib/prisma.js"

export const getProfile = async (req, res) => {
    try {
        const {userId} = req.params;
        
        const profile = await prisma.user.findUnique({
            where: {id: userId},
            select: { 
                name: true,
                email: true,
                avatarUrl: true,
                totalXp: true,
                currentStreak:true,
                level: true,
            }
        })

        if(!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(profile);

    } catch (error) {
        console.error("[Get Profile] error", error);
        return res.status(500).json({ message: "  Internal server error" });
        
    }
};

