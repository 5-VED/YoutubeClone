import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res, next) => {

    const { username, email, fullname, password } = req.body

    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const userExist = User.findOne({ $or: [{ username }, { email }] })
    if (userExist) {
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar field is required")
    }

    const user = await User.create({
        fullname,
        username,
        email,
        password
    })

    const isUserCreated = await User.findById(user._id).select("-password -refreshToken")

    if (!isUserCreated) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200,isUserCreated,"User created successfully")
    )

})

export { registerUser }