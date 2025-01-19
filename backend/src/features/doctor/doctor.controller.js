import DoctorRepository from "./doctor.repository.js";
import OtpController from "../otp/otp.controller.js";
import bcrypt from "bcryptjs";
import DoctorModel from "./doctor.model.js";
import cloudinary from "../../config/cloudinaryconfig.js";
import jwt from "jsonwebtoken";

// import { upload, uploadFiles } from "../../middleware/uploadfile.middleware.js";
import fs from "fs";
export default class DoctorController {
  constructor() {
    this.doctorRepository = new DoctorRepository();
    this.otpController = new OtpController();
  }

  async signIn(req, res, next) {
    try {
      // 1. Get the userType from the request body, default to 'patient'
      const { email, password } = req.body;

      let user = await this.doctorRepository.findByEmail(email); // Default is patient if not 'doctor'

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
              userType: "doctor",
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

  signUp = async (req, res, next) => {
    try {
      const { name, email, password, otp } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      let isVerified = false;
      console.log("req", req.body);
      console.log("otp", otp);
      isVerified = await this.otpController.verifyOtp(email, otp);
      if (isVerified) {
        const doctor = await this.doctorRepository.signUp({
          name,
          email,
          password: hashedPassword,
        });
        console.log("newdoctor:", doctor);
        return res.status(201).json(doctor);
      } else {
        return res.status(400).send({ error: "Invalid OTP" });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  // uploadDocument = async (req, res, next) => {
  //   try {
  //     if (
  //       !req.files ||
  //       !req.files["images"] ||
  //       !req.files["id"] ||
  //       !req.files["degree"]
  //     ) {
  //       return res.status(400).json({ message: "All files are required" });
  //     }

  //     // URLs of uploaded files
  //     const imageUrl = `/uploads/images/${req.files["images"][0].filename}`;
  //     const idPdfUrl = `/uploads/id/${req.files["id"][0].filename}`;
  //     const degreePdfUrl = `/uploads/degree/${req.files["degree"][0].filename}`;

  //     // Assuming `doctorId` is passed in the URL parameter
  //     const doctorId = req.params.doctorId;
  //     console.log("doctorId constroller", doctorId);
  //     console.log(req.params.doctorId);
  //     // Update the doctor document with the file URLs
  //     const updatedDoctor = await this.doctorRepository.uploadDocument({
  //       doctorId,
  //       imageUrl,
  //       idPdfUrl,
  //       degreePdfUrl,
  //     });

  //     console.log(updatedDoctor);
  //     return res.status(201).json({
  //       message: "Documents uploaded successfully",
  //       doctor: updatedDoctor,
  //     });
  //   } catch (err) {
  //     console.error("errrrrrrrrrrrrrrrr", err.message);
  //     next(err);
  //   }
  // };

  // Function to upload files to Cloudinary
  uploadToCloudinary = (filePath) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(filePath, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };

  uploadDocument = async (req, res, next) => {
    try {
      // Ensure the required files are uploaded
      if (
        !req.files ||
        !req.files["images"] ||
        !req.files["id"] ||
        !req.files["degree"]
      ) {
        return res.status(400).json({ message: "All files are required" });
      }

      // Upload each file to Cloudinary and get the URLs
      const imageUploadResult = await this.uploadToCloudinary(
        req.files["images"][0].path
      );
      const idUploadResult = await this.uploadToCloudinary(
        req.files["id"][0].path
      );
      const degreeUploadResult = await this.uploadToCloudinary(
        req.files["degree"][0].path
      );

      // Get URLs from the Cloudinary response
      const imageUrl = imageUploadResult.secure_url;
      const idPdfUrl = idUploadResult.secure_url;
      const degreePdfUrl = degreeUploadResult.secure_url;

      // Assuming `doctorId` is passed in the URL parameter
      const doctorId = req.params.doctorId;

      // Update the doctor document with the file URLs
      const updatedDoctor = await DoctorModel.findByIdAndUpdate(
        doctorId,
        {
          profileImageUrl: imageUrl,
          idproofUrl: idPdfUrl,
          degreeDocumentUrl: degreePdfUrl,
          steps: 2,
        },
        { new: true } // To return the updated document
      );

      console.log(updatedDoctor);

      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Send success response
      return res.status(201).json({
        message: "Documents uploaded successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      console.error("Error uploading documents:", err.message);
      next(err);
    } finally {
      // Clean up the temporary files on disk after uploading them to Cloudinary
      if (req.files) {
        req.files["images"] && fs.unlinkSync(req.files["images"][0].path);
        req.files["id"] && fs.unlinkSync(req.files["id"][0].path);
        req.files["degree"] && fs.unlinkSync(req.files["degree"][0].path);
      }
    }
  };

  uploadDocument2 = async (req, res, next) => {
    const doctorId = req.params.doctorId;
    try {
      const {
        gender,
        phone,
        city,
        state,
        clinicaddress,
        serviceType,
        specialization,
        experience,
      } = req.body;

      const updatedDoctor = await this.doctorRepository.uploadDocument2({
        doctorId,
        gender,
        phone,
        city,
        state,
        clinicaddress,
        serviceType,
        specialization,
        experience,
      });

      console.log(updatedDoctor);
      return res.status(201).json({
        message: "info uploaded successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      console.log("erroe in uploaddoc2 dc", err.message);
      next(err);
    }
  };

  uploadDocument3 = async (req, res, next) => {
    const doctorId = req.params.doctorId;
    try {
      const { consultationFee, availability } = req.body;
      console.log("availability in dc ", availability);
      const updatedDoctor = await this.doctorRepository.uploadDocument3({
        doctorId,
        consultationFee,
        availability,
        
      });

      console.log(updatedDoctor);

      return res.status(201).json({
        message: "info uploaded successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      console.log("erroe in uploaddoc3 dc", err.message);
      next(err);
    }
  };

  getAllDoctors = async (req, res, next) => {
    try {
      const doctors = await this.doctorRepository.getAllDoctors();
      // console.log("doctors", doctors);
      return res.status(200).json(doctors);
    } catch (err) {
      console.log("inside DC getall", err);
      next(err);
    }
  };

  getDoctorById = async (req, res, next) => {
    try {
      const doctorId = req.params.doctorId;
      console.log("doctorId in inside con", doctorId);
      const doctor = await this.doctorRepository.getDoctorById(doctorId);
      console.log("doctor in controller", doctor);
      return res.status(200).json(doctor);
    } catch (err) {
      console.log("inside DC getDoctorById", err);
      next(err);
    }
  };

  getFeedbackByDoctorId = async (req, res, next) => {
    try {
      const doctorId = req.params.doctorId;
      const feedbacks = await this.doctorRepository.getFeedbackByDoctorId(
        doctorId
      );
      return res.status(200).json(feedbacks.feedbacks);
    } catch (err) {
      console.log("inside DC getFeedbackByDoctorId", err);
      next(err);
    }
  };

  getAppointmentsByDoctorId = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const appointments =
        await this.doctorRepository.getAppointmentsByDoctorId(doctorId);
      console.log("appointments", appointments);
      console.log("avalibility", appointments.availability);
      return res.status(200).json(appointments.availability);
    } catch (err) {
      console.log("inside DC getAppointmentsByDoctorId", err);
      next(err);
    }
  };

  addavailability = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const { availability, consultationFee } = req.body;
      console.log("availability", availability);
      console.log("consultationFee", consultationFee);
      const updatedDoctor = await this.doctorRepository.addavailability(
        doctorId,
        availability,
        consultationFee
      );
      return res.status(201).json({
        message: "availability added successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      console.log("inside DC addavailability", err);
      next(err);
    }
  };
}
