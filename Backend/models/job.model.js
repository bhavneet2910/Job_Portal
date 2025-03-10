import { application } from "express";
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        requires:true
    },
    description:{
        type:String,
        requires:true
    },
    requirements:[{
        type:String,
    }],
    Salary:{
        type:Number,
        requires:true
    },
    experienceLevel:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    application:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Application',

    }]

},{timestamps:true});
export const Job = mongoose.model("Job",jobSchema);