import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Video from "../models/video.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { _id: likedBy } = req.user;

    if (!isValidObjectId(videoId)) throw new ApiError("Invalid Video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError("Video not found", 404);

    const existingLike = await Like.findOne({ video: videoId, likedBy });
    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json(new ApiResponse(200, null, " like  removed"));
    } else {
      const newLike = await Like.create({ video: videoId, likedBy });
      return res.status(200).json(new ApiResponse(200, newLike, "video Liked"));
    }
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { _id: likedBy } = req.user;

    const existingLike = await Like.findOne({ comment: commentId, likedBy });

    if (existingLike) {
      await existingLike.deleteOne();
      return res
        .status(200)
        .json(
          new ApiResponse(200, null, "Comment like toggled off successfully")
        );
    } else {
      const newLike = await Like.create({ comment: commentId, likedBy });
      return res
        .status(200)
        .json(
          new ApiResponse(200, newLike, "Comment like toggled on successfully")
        );
    }
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { _id: likedBy } = req.user;

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy });

    if (existingLike) {
      await existingLike.deleteOne();
      return res
        .status(200)
        .json(
          new ApiResponse(200, null, "tweet like toggled off successfully")
        );
    } else {
      const newLike = await Like.create({ tweet: tweetId, likedBy });
      return res
        .status(200)
        .json(
          new ApiResponse(200, newLike, "tweet like toggled on successfully")
        );
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ApiError(400, "Invalid input. Please check your request data.");
    }
    throw new ApiError(500, "Internal Server Error");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const { _id: likedBy } = req.user;

    // Use aggregation to fetch liked videos
    const likedVideos = await Like.aggregate([
      {
        $match: { likedBy: new mongoose.Types.ObjectId(likedBy) },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
        },
      },
      {
        $unwind: "$videoDetails",
      },
      {
        $project: {
          _id: "$videoDetails._id",
          title: "$videoDetails.title",
          description: "$videoDetails.description",
          // Add other fields you want to retrieve from the Video collection
        },
      },
    ]);

    if (!likedVideos || likedVideos.length === 0) {
      throw new ApiError(404, "No Liked Videos Found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
