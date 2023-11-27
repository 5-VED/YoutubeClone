import { asyncHandler } from "../utils/asyncHandeler.js";

const registerUser = asyncHandler(async (req, res, next) => {
    return res.status(200).json({
        message: "OK"
    })
})

export { registerUser }