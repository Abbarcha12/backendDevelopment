import { Router } from "express";
import { upLoadingVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/videosUpload").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  upLoadingVideo
);

export default router;
