import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const { videoId } = req.params;
    if (!content || !videoId) {
      throw new ApiError(400, "Content and Video ID are required!");
    }

    const newComment = await Comment.create({
      content,
      video: videoId,
      owner: req.user?._id,
    });
    if (!newComment) {
      throw new ApiError(400, "something went wrong while adding the comment!");
    }
    return res
      .status(201)
      .json(new ApiResponse(201, newComment, "New Comment Added to the video"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const updateComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    if (!content || !commentId) {
      throw new ApiError(400, "Content and Video ID are required!");
    }

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );
    if (!updateComment) {
      throw new ApiError(
        400,
        "something went wrong while updating  the comment!"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(201, updateComment, "New Comment Added to the video")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getVideoComments = asyncHandler(async (req, res) => {
  //   try {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  if (!videoId) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const videoComments = await Comment.aggregate([
    { $match: { video: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
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
          // Add other fields you want to retrieve from the User collection
        },
      },
    },
    {
      $sort: {
        createdAt: -1, // Sort by createdAt field in descending order
      },
    },
    { $skip: (pageNumber - 1) * limitNumber },
    { $limit: limitNumber },
  ]);
  if (!videoComments) {
    throw new ApiError(404, "No Comments Found for the Video");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, videoComments, "Video comments fetched successfully")
    );
  //   } catch (error) {
  //     throw new ApiError(500, "Internal Server Error");
  //   }
});

export const deleteComment = asyncHandler(async (req, res) => {
  //   try {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Content and Video ID are required!");
  }

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment) {
    throw new ApiError(
      400,
      "something went wrong while deleting  the comment!"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "comment delete successfully"));
  //   } catch (error) {
  //     throw new ApiError(500, "Internal Server Error");
  //   }
});
