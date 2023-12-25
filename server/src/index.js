import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {
    app
} from "./app.js"

dotenv.config({
    path: './env'
})
connectDB(() => {
        app.on('error', (error) => {
            console.log("ERROR", error)
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is Running at ${process.env.PORT}`)
        })

    })
    .then()
    .catch((err) => {
        console.log("MONGO db connection failed !", err)
    })