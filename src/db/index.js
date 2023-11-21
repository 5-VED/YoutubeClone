import mongoose from "mongoDB"
import { DB_NAME } from "../constants"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log('')

    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }

}

export default connectDB