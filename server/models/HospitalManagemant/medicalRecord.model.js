import mongoose from "mongoose"

const MedicalSchema = new mongoose.Schema({
    
},{timestamps:true})





export const Medical = mongoose.model("Medical",MedicalSchema)