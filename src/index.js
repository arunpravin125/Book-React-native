import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { authRouters } from "./Routes/authRoutes.js"
import { connectDB } from "./database/db.js"
import { bookRoutes } from "./Routes/bookRoutes.js"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()
const PORT = process.env.PORT || 3001

app.use("/api/auth/",authRouters)
app.use("/api/books/",bookRoutes)


app.listen(PORT,()=>{
    connectDB()
    console.log("Server sarted:",PORT)
})