import express from "express";
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true}, //unique : true karvanu
  password: { type: String, required: true },
  phone: { type: String },   //second
  steps: { type: Number, default: 1 }, // To track the registration steps
  gender:{type:String , enum : ["Male" , "Female"]  },  //second
  clinicaddress : {type:String}, //second
  pincode : {type:Number},   //second
  city : {type:String},   //second
  state : {type:String},  //second
  specialization: { type: String ,
     enum: ["Cardiologist", "Dermatologist", "Endocrinologist", "Gastroenterologist", "Gynecologist", "Hematologist", 
      "Infectious Disease Specialist", "Nephrologist", "Neurologist", "Oncologist",
       "Others"]
    }, //second
  experience: { type: Number }, // In years  //second
  consultationFee: { type: Number }, 
  availability: [
    {
      day: { type: String }, // e.g., Monday
      slots : [{type:String}] // e.g., ["10:00 AM", "11:00 AM", "12:00 PM"]
    }, 
  ],
  serviceType: {
    type: String,
    enum: ["Online", "Offline", "Both"], // Options for the type of service  
  },
  idproofUrl: { type: String },
  profileImageUrl: { type: String }, // URL for the uploaded profile image}
  degreeDocumentUrl: {
    type: String,
  }, // URL for the uploaded degree PDF

  verificationStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  }, // Status of verification
  feedbacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const DoctorModel = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
