import mongoose from "mongoose";
import Video from "../models/video.models.js";
import Subscription from "../models/subscription.model.js";
import { Like } from "../models/likes.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  try {
    const totalVideoViews = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const totalSubscribers = await Subscription.countDocuments({
      channel: channelId,
    });

    const totalVideos = await Video.countDocuments({
      videoOwner: channelId,
    });

    const totalLikes = await Like.countDocuments({
      video: {
        $in: await Video.find({ videoOwner: channelId }).distinct("_id"),
      },
    });

    const channelStats = {
      totalVideoViews:
        totalVideoViews.length > 0 ? totalVideoViews[0].totalViews : 0,
      totalSubscribers,
      totalVideos,
      totalLikes,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, channelStats, "Channel stats fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
    try {
      if (!req.user?._id) {
        throw new ApiErrorHandler(400, "user not found, login please");
      }
  
      // Get all videos uploaded by the channel
      const channelVideos = await Video.find({ owner: req.user?._id });
  
      if (!channelVideos || channelVideos.length === 0) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              channelVideos || [],
              "this channel do not have any video Yet"
            )
          );
      }
  
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            channelVideos,
            "Channel videos fetched successfully"
          )
        );
    } catch (error) {
      throw new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error while fetching channel videos"
      );
    }
  });

export { getChannelStats, getChannelVideos };
