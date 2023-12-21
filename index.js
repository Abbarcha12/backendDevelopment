import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express()


app.listen(process.env.PORT,()=>{
    console.log(`Server is Running in ${process.env.PORT}`)
})


app.get("/",(req,res)=>{
return res.status(200).json({
    message:"Hello"
})
})