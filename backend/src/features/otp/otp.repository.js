import crypto from 'crypto';
import OtpModel from './otp.model.js';
// import UserModel from '../users/user.model.js';

export default class OtpRepository {
    async sendOtp(email) {
        const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
        const otpDoc = new OtpModel({ otp, email });
        await otpDoc.save();
        return otp;
    }

    async verifyOtp(email, otp) {
        // console.log(otp)
        const otpRecord = await OtpModel.findOne( {email,otp} );
        if (otpRecord) {
            await OtpModel.deleteOne({ email, otp }); // Remove OTP after verification
            return true;
        }
        return false;
    }

    // async resetPassword(userId, hashedPassword) {
    //     // Update the user's password in the database
    //     await UserModel.updateOne({ _id: userId }, { password: hashedPassword });
    // }
}