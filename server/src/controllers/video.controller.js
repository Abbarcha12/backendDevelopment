import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadFile } from "../utils/fileUpload.js";
import Video from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const upLoadingVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  if ([title, description, duration].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required !");
  }

  const videoFileLocalpath = await req.files?.videoFile[0]?.path;
  if (!videoFileLocalpath) {
    throw new ApiError(400, "Video file is Required");
  }
  let thumbnailLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.thumbnailLocalPath) &&
    req.files.thumbnailLocalPath.length > 0
  ) {
    thumbnailLocalPath = await req.files?.thumbnailLocalPath[0]?.path;
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnailLocalPath file is Required");
  }
  console.log(videoFileLocalpath, thumbnailLocalPath);
  try {
 

  const videoFile = await UploadFile(videoFileLocalpath);
  const thumbnail = await UploadFile(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video file upload failed");
  }

  const video = await Video.create({
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    duration: duration.toLowerCase(),
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong while Uploading the video !");
  }

  res
    .status(201)
    .json(new ApiResponse(200, video, "Video Uploaded successFully"));
});
