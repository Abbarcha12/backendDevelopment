import mongoose from "mongoose"

const PatientSchema = new mongoose.Schema({

      name:{
        type:String,
        required:true
      },
      diagonsedWith:{
        type:String,
        required:true
      },
      address:{
        type:String,
        required:true
      },
      name:{
        type:Number,
        required:true
      },
      bloodGroup:{
        type:String,
        required:true
      },
      gender:{
        type:String,
        enum:["MALE","FEMALE","OTHERS"],
        required:true
      },
      admittedIn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital"
      }
},{timestamps:true})





export const Patient = mongoose.model("Patient",PatientSchema)