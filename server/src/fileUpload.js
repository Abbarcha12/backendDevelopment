import {
    v2 as cloudinary
} from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_NAME_API,
    api_secret: process.env.CLOUD_NAME_SECRECT
});

const UploadFile = async (LocalFilePath) => {
    try {
        if (!LocalFilePath) return null
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: auto
        })
        console.log("File is upload ", response.url)
        return response
    } catch (error) {
        fs.unlinkSync(LocalFilePath)
        return null
    }
}

export {UploadFile}