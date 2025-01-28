import PatientRepository from "./patient.repository.js";
import OtpController from "../otp/otp.controller.js";
import DoctorRepository from "../doctor/doctor.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendToken } from "../../utils/sendToken.js";
// import sendToken from '../../utils/sendToken.js'

export default class PatientController {
  constructor() {
    this.patientRepository = new PatientRepository();
    this.otpController = new OtpController();
    this.doctorRepository = new DoctorRepository();
  }

  signUp = async (req, res, next) => {
    try {
      const { name, email, password, otp } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);

      let isVerified = false;
      isVerified = await this.otpController.verifyOtp(email, otp);
      // console.log(consoleOtp);
      console.log(isVerified);
      let newPatient;
      if (isVerified) {
        newPatient = await this.patientRepository.signUp(
          name,
          email,
          hashedPassword
        );
      } else {
        return res.status(400).send({ error: "Invalid OTP" });
      }
      console.log(newPatient);
      if (newPatient) return res.status(201).send(newPatient);
      else
        return res.status(400).send("Something went wrong user is not created");
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  async signIn(req, res, next) {
    try {
      // 1. Get the userType from the request body, default to 'patient'
      const { email, password } = req.body;

      
      
      let user = await this.patientRepository.findByEmail(email); // Default is patient if not 'doctor'

      console.log(user);

      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        // 3. Compare password with hashed password.
        console.log(user.password);
        console.log(password);
        const result = await bcrypt.compare(
          password.trim(),
          user.password.trim()
        ); 
        console.log("Password match result: ", result);

        if (result) {
          // 4. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
              userType: "patient",
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "5h",
            }
          );

          // 5. Send token.
          console.log("Generated Token:", token);
          const payload = token.split(".")[1];
          console.log("Payload: ", payload);
          const decodedPayload = atob(payload);

          console.log("Decoded Payload: ", decodedPayload);
          
          // await sendToken(user, token, res, 200);
          // return res.status(200).cookie("token", token).send({ user, token });
          // console.log("User: ", req.cookies["token"]);
          
          return res.status(200).send({ user: user, token }); // You could alternatively return user info here
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
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
      const userId = req.userID; // Get the user ID from the request object
      const userType = req.userType; // Get the user type from the request object
      console.log("user type is : ", userType);
      // const userId = req.params.userId;    // in routes :userId that's why req.params.userId
      console.log("user id is : ", userId);
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
  getFeedbackByPatientId = async (req, res, next) => {
    try {
      const patientId = req.params.id;
      const feedbacks = await this.patientRepository.getFeedbackByPatientId(
        patientId
      );
      if (feedbacks === null) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      return res.status(200).json(feedbacks.feedbacks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error getting feedback" });
    }
  };

  getPatientById = async (req, res, next) => {
    try {
      const patientId = req.params.id;
      const patient = await this.patientRepository.getPatientById(patientId);
      if (patient === null) {
        return res.status(404).json({ message: "Patient not found" });
      }
      return res.status(200).json(patient);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error getting patient" });
    }
  };

  getAppointmentsByPatientId = async (req, res, next) => {
    try {
      const patientId = req.params.pid;
      const appointments = await this.patientRepository.getAppointmentsByPatientId(
        patientId
      );
      if (appointments === null) {
        return res.status(404).json({ message: "Appointments not found" });
      }
      return res.status(200).json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error getting appointments" });
    }
  };

}
