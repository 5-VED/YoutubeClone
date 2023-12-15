import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Refresh or Access Tokern", error)
    }
}


/**
 *  @route http://localhost:3000/api/v1/user/register
 *  @method POST
 *  @action Controller to register new User
 */
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
        new ApiResponse(200, isUserCreated, "User created successfully")
    )

})

/**
 *  @route http://localhost:3000/api/v1/user/login
 *  @method POST
 *  @action Controller to Login User
 */
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body

    if (!username || !email) {
        throw new ApiError(400, 'Username or Email is required')
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, 'User not Found')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid User Credentials')
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfuly")
        )
})


/**
 *  @route http://localhost:3000/api/v1/user/logout
 *  @method POST
 *  @action Controller to Logout User
 */
const logOutUser = asyncHandler(async (req,res,next) => {
    const user = await User.find
})
export { registerUser, loginUser }