import express from "express";
import 'dotenv/config'
import cors from "cors";


import profileRouter from "./router/profile.routes.js";
import userRouter from "./router/user.routes.js";
import LearningPathRouter from "./router/learningPath.routes.js";
import checkpointRouter from "./router/checkpoint.routes.js";
import streakRouter from "./router/streak.routes.js";
// import dailyQuizRouter from "./router/daily-quiz.routes.js";
import leaderboardRouter from "./router/leaderboard.routes.js";
// import quizRouter from "./router/streak.routes.js";
// import chatRouter from "./router/chat.routes.js";




const app = express();

app.use(cors({
    origin: "http://localhost:4000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());

app.use("/api/profile",profileRouter);
app.use("/api/user",userRouter);
app.use("/api/learning-path",LearningPathRouter);
app.use("/api/checkpoint",checkpointRouter);
// app.use("/api/daily-quiz",dailyQuizRouter);
app.use("/api/leaderboard",leaderboardRouter);
app.use("/api/streak",streakRouter);
// app.use("api/chat",chatRouter);


app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});