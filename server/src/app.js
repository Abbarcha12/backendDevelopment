import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: "16kb",
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.routes.js";
import videosRouter from "./routes/video.router.js";
import tweetRouter from "./routes/tweet.router.js";
import commentRouter from "./routes/comment.router.js";
import likeRouter from "./routes/like.router.js";
import playListRouter from "./routes/playlist.router.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import dashboardRouter from "./routes/dashboard.router.js";
// Routes Declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videosRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/playlist", playListRouter);
app.use("/api/v1/sub", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
