import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadFile } from "../utils/fileUpload.js";
import Video from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
