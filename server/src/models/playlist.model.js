import mongoose, { Schema } from "mongoose";

const videoListSchema = new Schema(
  {
    videoName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const videoPlaylist = mongoose.model("videoPlaylist", videoListSchema);
export default videoPlaylist;
