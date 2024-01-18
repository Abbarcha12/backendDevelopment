import mongoose, { isValidObjectId } from "mongoose";
import videoPlaylist from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const { videoName, description } = req.body;

    if (!videoName || !description) {
      throw new ApiError(400, "Name and Description are required");
    }

    const ownerId = req.user._id;

    const newPlaylist = await videoPlaylist.create({
      videoName,
      description,
      owner: ownerId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError(400, "Invalid User ID");
    }

    const playlists = await videoPlaylist
      .find({ owner: userId })
      .populate("videos", "_id title thumbnail duration")
      .populate("owner", "_id username");

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlists, "User playlists fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

// Get Playlist by ID
export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  try {
    if (!playlistId) {
      throw new ApiError(400, "Invalid Playlist ID");
    }

    // Find the playlist by ID
    const playlist = await videoPlaylist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  try {
    if (!playlistId || !videoId) {
      throw new ApiError(400, "Invalid Playlist or Video ID");
    }

    const playlist = await videoPlaylist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (playlist.videos.includes(videoId)) {
      throw new ApiError(400, "Video is already in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
});

// Remove Video from Playlist
export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  try {
    if (!playlistId || !videoId) {
      throw new ApiError(400, "Invalid Playlist or Video ID");
    }

    const playlist = await videoPlaylist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    const videoIndex = playlist.videos.indexOf(videoId);

    if (videoIndex === -1) {
      throw new ApiError(404, "Video not found in the playlist");
    }

    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
});

// Delete Playlist
export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  try {
    if (!playlistId) {
      throw new ApiError(400, "Invalid Playlist ID");
    }

    const playlist = await videoPlaylist.findByIdAndDelete(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Playlist deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
});

// Update Playlist
export const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoName, description } = req.body;

  try {
    if (!playlistId) {
      throw new ApiError(400, "Invalid Playlist ID");
    }

    const playlist = await videoPlaylist.findByIdAndUpdate(
      playlistId,
      {
        videoName,
        description,
      },
      {
        $set: true,
      }
    );

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
});
