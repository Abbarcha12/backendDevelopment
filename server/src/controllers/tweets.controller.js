import { Tweet } from "../models/tweets.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import User from "../models/user.models.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  // Validate content
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  // Validate user id
  if (!userId) {
    throw new ApiError(400, "Invalid user id");
  }

  // Create a new tweet
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  // Validate tweet creation
  if (!tweet) {
    throw new ApiError(400, "Error while creating tweet");
  }

  // Fetch owner details using aggregation

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet created successfully"));
});

export const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      throw new ApiError(500, "Invalid Tweet ID");
    }

    const newTweet = await Tweet.findByIdAndDelete(tweetId);
    if (!newTweet) {
      throw new ApiError(404, "Tweet not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "tweet deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getAllTweets = asyncHandler(async (req, res) => {
  try {
    const allTweets = await Tweet.find({});
    if (!allTweets) {
      throw new ApiError(500, "Tweets not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allTweets, "All tweets Fetch Successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error ");
  }
});

export const getUserTweet = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    if (!userId) {
      throw new ApiError(400, "Invalid user id");
    }

    const userTweets = await Tweet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },

      {
        $unwind: "$ownerDetails", // Unwind to handle multiple tweets in case there are duplicates
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          owner: {
            _id: "$ownerDetails._id",
            username: "$ownerDetails.username",
            fullName: "$ownerDetails.fullName",
          },
        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(200, userTweets, "User tweets fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const updateTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content } = req.body;

    // Check if the tweetId is a valid ObjectId
    if (!tweetId) {
      throw new ApiError(400, "Invalid tweet id");
    }

    // Validate the content
    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { $set: { content } },
      { new: true }
    );

    if (!updatedTweet) {
      throw new ApiError(404, "Tweet not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});
