import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    video: [
      {
        type: Schema.Types.ObjectId,
        ref: "video",
      },
    ],
    tweet: [
      {
        type: Schema.Types.ObjectId,
        ref: "tweets",
      },
    ],
    likedBy: [
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

const Likes = mongoose.model("Likes", likeSchema);
export default Likes;
