import DoctorRepository from "./doctor.repository.js";
import OtpController from "../otp/otp.controller.js";
import bcrypt from "bcryptjs";
import DoctorModel from "./doctor.model.js";
import cloudinary from "../../config/cloudinaryconfig.js";
import jwt from "jsonwebtoken";
import path from "path";
import mongoose from "mongoose";
import AppointmentModel from "../appointments/appointments.model.js";
import fs from "fs";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export default class DoctorController {
  constructor() {
    this.AppointmentModel = AppointmentModel;
    this.doctorRepository = new DoctorRepository();
    this.otpController = new OtpController();
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      let user = await this.doctorRepository.findByEmail(email);

      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        const result = await bcrypt.compare(
          password.trim(),
          user.password.trim()
        );
        if (result) {
          // create token.
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
          // send token.
          return res.status(200).send({ user: user, token });
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      // console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  signUp = async (req, res, next) => {
    try {
      const { name, email, password, otp } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      let isVerified = false;
      isVerified = await this.otpController.verifyOtp(email, otp);
      if (isVerified) {
        const doctor = await this.doctorRepository.signUp({
          name,
          email,
          password: hashedPassword,
        });
        return res.status(201).json(doctor); //doctor created..
      } else {
        return res.status(400).send({ error: "Invalid OTP" });
      }
    } catch (err) {
      // console.log(err);
      next(err);
    }
  };

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
      if (
        !req.files ||
        !req.files["images"] ||
        !req.files["id"] ||
        !req.files["degree"]
      ) {
        return res.status(400).json({ message: "All files are required" });
      }

      // upload each file to cloudinary and get the URLs to store in the database
      const imageUploadResult = await this.uploadToCloudinary(
        req.files["images"][0].path
      );
      const idUploadResult = await this.uploadToCloudinary(
        req.files["id"][0].path
      );
      const degreeUploadResult = await this.uploadToCloudinary(
        req.files["degree"][0].path
      );

      // get URLs from the cloudinary response
      const imageUrl = imageUploadResult.secure_url;
      const idPdfUrl = idUploadResult.secure_url;
      const degreePdfUrl = degreeUploadResult.secure_url;

      const doctorId = req.params.doctorId;

      const updatedDoctor = await this.doctorRepository.uploadDocument({
        doctorId,
        imageUrl,
        idPdfUrl,
        degreePdfUrl,
      });

      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      return res.status(201).json({
        message: "Documents uploaded successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      // console.error("Error uploading documents:", err.message);
      next(err);
    } finally {
      // clean up the temporary files on disk after uploading them to cloudinary
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

      return res.status(201).json({
        message: "info uploaded successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      // console.log("erroe in uploaddoc2 dc", err.message);
      next(err);
    }
  };

  uploadDocument3 = async (req, res, next) => {
    const doctorId = req.params.doctorId;
    try {
      const { consultationFee, availability } = req.body;
      const updatedDoctor = await this.doctorRepository.uploadDocument3({
        doctorId,
        consultationFee,
        availability,
      });

      return res.status(201).json({
        message: "info uploaded successfully",
        doctor: updatedDoctor,
      });
    } catch (err) {
      // console.log("erroe in uploaddoc3 dc", err.message);
      next(err);
    }
  };

  getAllDoctors = async (req, res, next) => {
    try {
      const doctors = await this.doctorRepository.getAllDoctors();
      // console.log("doctors", doctors);
      return res.status(200).json(doctors);
    } catch (err) {
      // console.log("inside DC getall", err);
      next(err);
    }
  };

  getDoctorById = async (req, res, next) => {
    try {
      const doctorId = req.params.doctorId;
      const doctor = await this.doctorRepository.getDoctorById(doctorId);
      return res.status(200).json(doctor);
    } catch (err) {
      // console.log("inside DC getDoctorById", err);
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
      // console.log("inside DC getFeedbackByDoctorId", err);
      next(err);
    }
  };

  getAppointmentsByDoctorId = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const appointments =
        await this.doctorRepository.getAppointmentsByDoctorId(doctorId);
      // console.log("appointments", appointments);
      // console.log("avalibility", appointments);
      return res.status(200).json(appointments);
    } catch (err) {
      // console.log("inside DC getAppointmentsByDoctorId", err);
      next(err);
    }
  };

  getConfirmedAppointmentsByDoctorId = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const appointments =
        await this.doctorRepository.getConfirmedAppointmentsByDoctorId(
          doctorId
        );
      // console.log("appointments", appointments);
      // console.log("avalibility", appointments);
      return res.status(200).json(appointments);
    } catch (err) {
      // console.log("inside DC getConfirmedAppointmentsByDoctorId", err);
      next(err);
    }
  };

  addavailability = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const { availability, consultationFee } = req.body;
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
      // console.log("inside DC addavailability", err);
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const updatedDoctor = await this.doctorRepository.updateProfile(
        doctorId,
        req.body
      );
      if (!updatedDoctor) {
        return res
          .status(404)
          .json({ message: "Doctor not found", success: false });
      }
      return res.status(201).json({
        message: "Profile updated successfully",
        doctor: updatedDoctor,
        success: true,
      });
    } catch (err) {
      // console.log("inside DC addavailability", err);
      next(err);
    }
  };

  getWeeklyStats = async (req, res, next) => {
    try {
      const doctorId = req.params.did;
      const stats = await this.doctorRepository.getWeeklyStats(doctorId);
      return res.status(200).json(stats);
    } catch (err) {
      // console.log("inside DC getWeeklyStats", err);
      next(err);
    }
  };

  getWeeklyAppointments = async (req, res) => {
    try {
      const doctorId = req.params.did;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days

      const data = await AppointmentModel.aggregate([
        {
          $match: {
            doctor: new mongoose.Types.ObjectId(doctorId),
            date: { $gte: startDate },
            status: "Confirmed",
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const results = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];

        const found = data.find((d) => d._id === dateString);
        results.push({
          date: dateString,
          count: found ? found.count : 0,
        });
      }
      // console.log("results", results);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getMonthlyRevenue = async (req, res) => {
    try {
      const doctorId = req.params.did;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const endDate = new Date(currentYear, currentMonth, 0); // Last day of current month

      // Get aggregated data
      const data = await AppointmentModel.aggregate([
        {
          $match: {
            doctor: new mongoose.Types.ObjectId(doctorId),
            status: "Confirmed",
            date: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            revenue: { $sum: "$appointmentFees" },
          },
        },
        {
          $project: {
            year: "$_id.year",
            month: "$_id.month",
            revenue: 1,
            _id: 0,
          },
        },
      ]);

      // create array for months up to current month
      const monthCount = currentMonth;
      const fullYearData = Array.from({ length: monthCount }, (_, i) => ({
        month: i + 1,
        year: currentYear,
        revenue: 0,
      }));

      // merge actual data
      data.forEach((item) => {
        const index = item.month - 1;
        if (index >= 0 && index < monthCount) {
          fullYearData[index] = item;
        }
      });

      res.status(200).json(fullYearData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  getAppointmentTypes = async (req, res) => {
    try {
      const doctorId = req.params.did;

      const data = await AppointmentModel.aggregate([
        {
          $match: {
            doctor: new mongoose.Types.ObjectId(doctorId),
            status: { $in: ["Canceled", "Confirmed"] },
          },
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
