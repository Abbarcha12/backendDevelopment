import {
    asyncHandler
} from "../utils/asyncHandler.js";
import {
    ApiError
} from "../utils/ApiError.js"
import User from "../models/user.models.js"
// {Uses Register }
import {
    UploadFile
} from "../utils/fileUpload.js"
import { ApiResponse } from "../utils/ApiResponse.js";
export const userRegister = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        fullName,
        password
    } = await req.body

    if ([name, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields Required")
    }
    const existedUser = await User.findOne({
        $or: [{
            name
        }, {
            email
        }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username")
    }

    const avatarLocalPath = await req.files?.avatar[0]?.path
    const coverImageLocalPath = await req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image is required!")
    }
    const avatar = await UploadFile(avatarLocalPath)
    const coverImage = await UploadFile(coverImageLocalPath)

    if(!avatar){
                 throw new ApiError(400, "Avatar file is required!")   
    }

   const user= await User.create({
        name:name.toLowerCase(),
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""

    })
  const userCreated = await User.findById(user._id).select("-password -refreshToken")
  if(!userCreated){
    throw new ApiError(500, "Something went wrong while registering user")   
}
  return res.status(201).json(
    new ApiResponse(200,userCreated,"User Register SuccessFully")
  )
})