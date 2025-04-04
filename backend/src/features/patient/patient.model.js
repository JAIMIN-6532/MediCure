import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "password should be at least 8 characters long"],
  },
  phone: { type: String },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  feedbacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PatientModel = mongoose.model("Patient", patientSchema);

export default PatientModel;
