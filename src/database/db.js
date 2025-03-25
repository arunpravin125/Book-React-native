import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("mongoConnected",connection.connection.host)
    } catch (error) {
        console.log("error in connectDB",error.message)
    }
}