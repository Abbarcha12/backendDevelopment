import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_NAME_API,
  api_secret: process.env.CLOUD_NAME_SECRECT,
});

const UploadFile = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) {
      throw new Error("LocalFilePath is missing");
    }

    const response = await cloudinary.uploader.upload(LocalFilePath, {
      resource_type: "auto",
    });

    // Unlink the local file after successful upload
    fs.unlinkSync(LocalFilePath);
    console.log("Upload successful:", response);
    return response;
  } catch (error) {
    // Log the error, but do not rethrow it if the error occurred during unlink
    console.error("Error during upload:", error);

    try {
      // Attempt to unlink the file again if it hasn't been unlinked yet
      if (fs.existsSync(LocalFilePath)) {
        fs.unlinkSync(LocalFilePath);
        console.log("File unlinked successfully");
      }
    } catch (unlinkError) {
      // Log the unlinking error
      console.error("Error unlinking file:", unlinkError);
    }

    // Rethrow the original error
    throw error;
  }
};

export { UploadFile };
