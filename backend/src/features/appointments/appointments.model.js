import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointmentFees: { type: Number },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  paymentType: {
    type: String,
    enum: ["Online", "Offline"],
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // "10:00 AM - 10:30 AM"
  type: {
    type: String,
    enum: ["Online", "Offline"],
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Ongoing",
      "Confirmed",
      "Cancelled",
      "Completed",
      "Locked",
      "Released",
    ],
    default: "Confirmed",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

export default AppointmentModel;
