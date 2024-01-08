import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB Connection Error", error);
    process.exit();
  }
};

export default connectDB;
