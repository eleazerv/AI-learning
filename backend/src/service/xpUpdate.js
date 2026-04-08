
export const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    let day = startOfWeek.getUTCDay();
    const diff = (day === 0 ? 6 : day - 1);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - diff);
    startOfWeek.setUTCHours(0, 0, 0, 0);  // reset ke midnight UTC
    return startOfWeek;
};

export const systemXpUpdate = async (userId , XP ) => {
    const now = new Date()

    const periodStart = getStartOfWeek(now) ; 
    const result = await prisma.leaderboardEntry.upsert({
where: { userId_periodType_periodStart: { userId, periodType: "weekly", periodStart } },            update : { xpGained : { increment : XP } } , 
            create : { userId , periodStart , xpGained : XP, periodType : "weekly" , rank: 0 }
    })
    
}