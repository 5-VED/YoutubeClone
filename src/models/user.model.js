import { Schema, model } from "mongoose"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trin: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trin: true
    },
    fullname: {
        type: String,
        required: true,
        trin: true,
        index: true
    },
    avatar: {
        type: String, // Using Clouddinary URL
        require: true
    },
    coverImage: {
        type: String, // Using Clouddinary URL        
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }

}, {
    timestamps: true
})


export const User = model("User", userSchema)