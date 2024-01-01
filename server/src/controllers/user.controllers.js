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
import {
    ApiResponse
} from "../utils/ApiResponse.js";

export const userRegister = asyncHandler(async (req,res) => {

   
    const {
        username,
        email,
        fullName,
        password
    } = await req.body

    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields Required")
    }
    const existedUser = await User.findOne({
        $or: [{
            username
        }, {
            email
        }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already Exist !")
    }

    const avatarLocalPath = await req.files?.avatar[0]?.path

    // const coverImageLocalPath = await req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = await req.files?.coverImage[0]?.path

    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image is required!")
    }
    const avatar = await UploadFile(avatarLocalPath)
    const coverImage = await UploadFile(coverImageLocalPath)


    if (!avatar) {
        throw new ApiError(400, "Avatar file is required!")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""

    })
    const userCreated = await User.findById(user._id).select("-password -refreshToken")
    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering user")
    }
    return res.status(201).json(
        new ApiResponse(200, userCreated, "User Register SuccessFully")
    )
})


const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken =    user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken=refreshToken 

        user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while creating the token ")
        
    }

}

export const userLogin = asyncHandler(async (req,res)=>{
    const {email, password} = req.body

    if(!email || !username ){
        throw new ApiError(400,"email and username  is required!")
    }
    
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user ){
        throw new ApiError(400,"User does not Exist!")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid ){
        throw new ApiError(400,"Invalid user credentials !")
    }
      
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)
    const loggedInUser =await User.findById(user._id).Select("-password,-refreshToken")

    const options ={
        httpOnly:true,
        secure:true
    }
   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(200,{
        user:loggedInUser,
        accessToken,
        refreshToken
    },
    "User logged in successfully"
    )
   )

}
)



export const userLogout = asyncHandler(async(req,res)=>{
    const userId  = req.user._id
    await User.findById(userId,{
        $set:{
            refreshToken:undefined
        }
    },{
        new:true
    })


    const options ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie(accessToken,options)
    .clearCookie(refreshToken)
    .json(new ApiResponse(200,{},"User Log Out"))
})