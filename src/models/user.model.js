import { Schema, model } from "mongoose"
import { hash, compare, hashSync } from "bcrypt"
import jwt from "jsonwebtoken"

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

// Pre hook to encrypt password 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await hash(this.password, 10)
    next()
})

// Custom method to validate password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await compare(password, this.password)

}

// Custom method to create Access Tokend
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Custom method to create Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = model("User", userSchema)