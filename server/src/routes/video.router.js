import { Router } from "express";
import {
  AllVideos,
  SingleVideos,
  deleteVideo,
  gettingVideoOwner,
  togglePublishStatus,
  upLoadingVideo,
  updateThumbnail,
  updateVideoFile,
  updateVideos,
} from "../controllers/video.controller.js";
import { FilesUpload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/videosUpload").post(
  verifyJWT,
  FilesUpload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  upLoadingVideo
);
router.route("/videoOwner/:id").get(gettingVideoOwner);
router.route("/videos").get(AllVideos);
router.route("/videos/:id").get(SingleVideos);
router.route("/updateVideo/:id").patch(updateVideos);
router
  .route("/updateVideoFile/:id")
  .patch(FilesUpload.single("videoFile"), updateVideoFile);
router
  .route("/updateThumbnail/:id")
  .patch(FilesUpload.single("thumbnail"), updateThumbnail);
router.route("/deleteVideo/:id").delete(deleteVideo);
router.route("/videoPublished/:id").get(togglePublishStatus);

export default router;
