import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized User")
        }

        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        console.log("decoded=====>",decodedToken)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log('user====>',user)

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(500, "Something went wrong while verifying access token" || error?.message)
    }
})