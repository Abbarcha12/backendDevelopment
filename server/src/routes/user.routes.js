import { Router } from "express";
import {
  changeCurrentPassword,
  currentUser,
  refreshAccessToken,
  userLogin,
  userLogout,
  updateUser,
  userRegister,
  updateUserAvater,
  updateCoverImage,
  getUserChannel,
  getUserWatchHistory,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { FilesUpload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
  FilesUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegister
);

router.route("/login").post(userLogin);

// secured routes

router.route("/logout").post(verifyJWT, userLogout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, currentUser);
router.route("/update-user").patch(verifyJWT, updateUser);
router
  .route("/avatar")
  .patch(verifyJWT, FilesUpload.single("avatar"), updateUserAvater);
router
  .route("/cover-image")
  .patch(verifyJWT, FilesUpload.single("coverImage"), updateCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannel);
router.route("/history").get(verifyJWT, getUserWatchHistory);

router.route("/login");

export default router;
