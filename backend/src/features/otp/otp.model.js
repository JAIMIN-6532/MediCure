import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  otp: { type: Number },
  email: { type: String, required: true },
  createdat: { type: Date, default: Date.now, expires: 60 * 5 , }, //5 min expires
});

const OtpModel = new mongoose.model("OtpModel", OtpSchema);

export default OtpModel;


const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const newOtp = new OtpModel({ email, otp });
  await newOtp.save();
  return otp;
}


