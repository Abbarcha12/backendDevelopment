import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getUserTweet,
  updateTweet,
} from "../controllers/tweets.controller.js";

const router = Router();
router.route("/createTweet").post(verifyJWT, createTweet);
router.route("/getAllTweets").get(getAllTweets);
router.route("/deleteTweet/:tweetId").delete(verifyJWT, deleteTweet);
router.route("/getUserTweet").get(verifyJWT, getUserTweet);
router.route("/updateTweet/:tweetId").patch(verifyJWT, updateTweet);

export default router;
