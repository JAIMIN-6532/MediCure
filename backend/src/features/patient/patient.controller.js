import PatientRepository from "./patient.repository.js";
import OtpController from "../otp/otp.controller.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendToken } from "../../utils/sendToken.js";
// import sendToken from '../../utils/sendToken.js'

export default class PatientController{
    constructor(){
        this.patientRepository = new PatientRepository();
        this.otpController = new OtpController();
    }

    signUp = async (req, res, next) => {
        try {
          const { name, email, password ,otp} = req.body;
          const hashedPassword = await bcrypt.hash(password, 12);
    
          let isVerified = false;
          isVerified = await this.otpController.verifyOtp(email,otp);
          // console.log(consoleOtp);
          console.log(isVerified);
          let newPatient;
          if(isVerified) {
           newPatient = await this.patientRepository.signUp(
            name,
            email,
            hashedPassword
          );
           } else {
            return res.status(400).send("Invalid OTP");
           }
          console.log(newPatient);
          return res.status(201).send(newPatient);
        } catch (err) {
          console.log(err);
          next(err);
        }
      };
    
      async signIn(req, res, next) {
        try {
          // 1. Find user by email.
          console.log(req.body);
          const user = await this.patientRepository.findByEmail(req.body.email);
          console.log(user);
          if (!user) {
            return res.status(400).send("Incorrect Credentials");
          } else {
            // 2. Compare password with hashed password.
            const result = await bcrypt.compare(req.body.password, user.password);
            console.log("res is" ,result);
            if (result) {
              // 3. Create token.
              const token = jwt.sign(
                {
                  userID: user._id,
                  email: user.email,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "5h",
                }
              );
              // 4. Send token.
    
              console.log(token);
              await sendToken(user,token, res, 200);
              // return res.status(200).json({ user: user, token });
            } else {
              return res.status(400).send("Incorrect Credentials");
            }
          }
        } catch (err) {
          console.log(err);
          return res.status(200).send("Something went wrong");
        }
      }
      userLogout = (req, res, next) => {
        res
        .status(200)
        .cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        })
        .json({ success: true, msg: "logout successful" });
      };
    
      
      async getUserById(req, res, next) {
        try {
          const userId = req.params.userId;    // in routes :userId that's why req.params.userId
          console.log(userId);
          const user = await this.patientRepository.getUserById(userId);
          console.log(user);
          if (user) {
            res.status(200).send(user);
          } else {
            return res.status(400).send("user not found");
          }
        } catch (err) {
          console.log(err);
          return res.status(200).send("Something went wrong");
        }
      }
}