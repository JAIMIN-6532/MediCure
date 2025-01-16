import OtpRepository from "./otp.repository.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from "../../utils/emails/otpMail.js";

export default class OtpController {
    constructor() {
        this.OtpRepository = new OtpRepository();
    }

    sendOtp = async (req,res,next) => {
        try {
          const { email } = req.body;
    
          // Generate OTP
          const otp = await this.OtpRepository.sendOtp(email);
    
          // Send OTP via email
          await sendOTPEmail(email, otp);

        //   return otp;
    
          return res.status(200).json({ message: "OTP sent successfully!" });
        } catch (err) {
          console.error("Error in sendOtp:", err);
          next(err);
        }
      };

    async verifyOtp(email,otp) {
        try {
            // const { otp } = req.body;
            const otpnum = parseInt(otp);
            console.log(otpnum);
            console.log(email,otp);
            // const userId = req.userID;
            // console.log(userId);
            const isValid = await this.OtpRepository.verifyOtp(email,otpnum);
            if (isValid) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Error in verifyOtp:", err);
                        return false;
        }
    }

    // async resetPassword(req, res, next) {
    //     try {
    //         const {  otp, newPassword } = req.body;
    //         const userId = req.userID;
    //         // First, verify the OTP
    //         const isValidOtp = await this.OtpRepository.verifyOtp(userId, otp);
    //         if (!isValidOtp) {
    //             return res.status(400).json({ message: 'Invalid or expired OTP!' });
    //         }

    //         // Hash the new password
    //         const hashedPassword = await bcrypt.hash(newPassword, 10);

    //         // Update the user's password
    //         await this.OtpRepository.resetPassword(userId, hashedPassword);

    //         res.status(200).json({ message: 'Password reset successfully!' });
    //     } catch (err) {
    //         next(err);
    //     }
    
    // }
}