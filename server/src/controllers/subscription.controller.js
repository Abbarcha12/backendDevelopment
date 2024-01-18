import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/user.models.js";
import Subscription from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { _id: subscriberId } = req.user;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  const channelExists = await User.exists({ _id: channelId });
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    subscribe: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    // If subscription exists, remove it (toggle off)
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Subscription toggled off successfully")
      );
  } else {
    // If subscription doesn't exist, create it (toggle on)
    const newSubscription = await Subscription.create({
      subscribe: subscriberId,
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newSubscription,
          "Subscription toggled on successfully"
        )
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscribe",
    "username fullName avatar"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscribeId } = req.params;

  if (!isValidObjectId(subscribeId)) {
    throw new ApiError(400, "Invalid channelId ID");
  }

  const subscribedChannels = await Subscription.find({
    subscribe: subscribeId,
  }).populate("channel", "username fullName avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
