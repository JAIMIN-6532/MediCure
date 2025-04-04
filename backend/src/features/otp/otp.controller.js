import OtpRepository from "./otp.repository.js";
import { sendOTPEmail } from "../../utils/emails/otpMail.js";

export default class OtpController {
  constructor() {
    this.OtpRepository = new OtpRepository();
  }

  sendOtp = async (req, res, next) => {
    try {
      const { email } = req.body;

      // Generate OTP
      const otp = await this.OtpRepository.sendOtp(email);

      // Send OTP via email
      await sendOTPEmail(email, otp);

      //   return otp;

      return res.status(200).json({ message: "OTP sent successfully!" });
    } catch (err) {
      // console.error("Error in sendOtp:", err);
      next(err);
    }
  };

  async verifyOtp(email, otp) {
    try {
      const otpnum = parseInt(otp);
      const isValid = await this.OtpRepository.verifyOtp(email, otpnum);
      if (isValid) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // console.error("Error in verifyOtp:", err);
      return false;
    }
  }
}
