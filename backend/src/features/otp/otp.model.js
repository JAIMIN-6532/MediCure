import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  otp: { type: Number },
  email: { type: String, required: true },
  createdat: { type: Date, default: Date.now, expires: 60 * 5 , }, //5 min expires
});

const OtpModel = new mongoose.model("OtpModel", OtpSchema);

export default OtpModel;




