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
// Routes Declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videosRouter);
