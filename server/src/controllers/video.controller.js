import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadFile } from "../utils/fileUpload.js";
import Video from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const upLoadingVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  if ([title, description, duration].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }
  const numericDuration = parseInt(duration); // Convert duration to a number
  if (isNaN(numericDuration)) {
    throw new ApiError(400, "Invalid duration format");
  }
  const videoFileLocalpath = req.files?.videoFile[0]?.path;

  if (!videoFileLocalpath) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  try {
    const videoFile = await UploadFile(videoFileLocalpath);
    const thumbnail = await UploadFile(thumbnailLocalPath);

    if (!videoFile) {
      throw new ApiError(400, "Video file upload failed");
    }

    if (!thumbnail) {
      throw new ApiError(400, "thumbnail file upload failed");
    }

    const video = await Video.create({
      title: title.toLowerCase(),
      description: description.toLowerCase(),
      duration: numericDuration,
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
    });

    if (!video) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the video!"
      );
    }

    res
      .status(201)
      .json(new ApiResponse(200, video, "Video uploaded successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const AllVideos = asyncHandler(async (req, res) => {
  const Videos = await Video.find({});

  if (!Videos || Videos.length === 0) {
    throw new ApiError(404, "No Videos Found");
  }
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, Videos, "Videos fetch successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const SingleVideos = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Video ID is required");
  }

  try {
    const singleVideo = await Video.findById(id);

    if (!singleVideo) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, singleVideo, "Video fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const updateVideos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id, "ID");
  if (!id) {
    throw new ApiError(400, "Video Id is Required ");
  }
  const { title, description, duration } = req.body;

  if (!title || !description || !duration) {
    throw new ApiError(400, "All fields are Required!");
  }
  try {
    const video = await Video.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          duration,
        },
      },
      {
        new: true, //return the updated user instead of original one
      }
    );
    if (!video) {
      throw (new ApiError(404), "Video Not Update");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video Updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error ");
  }
});

export const updateVideoFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Id of video Required! ");
  }
  const videoLocalPath = req.file?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video Local Path not found ");
  }

  try {
    const videoFile = await UploadFile(videoLocalPath);

    if (!videoFile.url) {
      throw new ApiError(400, "Error while Uploading video File ");
    }

    const video = await Video.findByIdAndUpdate(
      id,
      {
        $set: {
          videoFile: videoFile.url,
        },
      },
      {
        new: true,
      }
    );
    if (!video) {
      throw new ApiError(400, "Video Not Found !");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "VideoFile updated Successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});
export const updateThumbnail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Id of video Required! ");
  }
  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Video Local Path not found ");
  }

  try {
    const thumbnail = await UploadFile(thumbnailLocalPath);

    if (!thumbnail.url) {
      throw new ApiError(400, "Error while Uploading video File ");
    }

    const thumbnailFile = await Video.findByIdAndUpdate(
      id,
      {
        $set: {
          thumbnail: thumbnail.url,
        },
      },
      {
        new: true,
      }
    );
    if (!thumbnail) {
      throw new ApiError(400, "Video Not Found !");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, thumbnailFile, "Thumbnail updated Successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error !");
  }
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Id is required !");
  }

  try {
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res.status(200, {}, "Video deleted successfully");
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const gettingVideoOwner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "No Video ID Provided!");
  }
  try {
    const videoOwner = await Video.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "User",
          localField: "owner",
          foreignField: "_id",
          as: "Video_Owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          _id: 1,
          title: 1, // Add other fields you want to retrieve from the Video collection
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            fullName: "$owner.fullName",
            // Add other fields you want to retrieve from the User collection
          },
        },
      },
    ]);
    if (!videoOwner) {
      throw new ApiError(404, "Video not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          videoOwner[0],
          "Video with owner fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error ");
  }
});
