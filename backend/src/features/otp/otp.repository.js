import crypto from 'crypto';
import OtpModel from './otp.model.js';

export default class OtpRepository {
    async sendOtp(email) {
        const otp = crypto.randomInt(100000, 999999); // generate a 6-digit OTP
        const otpDoc = new OtpModel({ otp, email });
        await otpDoc.save();
        return otp;
    }

    async verifyOtp(email, otp) {
        // console.log(otp)
        const otpRecord = await OtpModel.findOne( {email,otp} );
        if (otpRecord) {
            await OtpModel.deleteOne({ email, otp }); // remove OTP after verification
            return true;
        }
        return false;
    }

}