import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        minlength:6,
        required:true

    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    profileImg:{
        type:String,
        default:""
    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)