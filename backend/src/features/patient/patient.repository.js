import patientModel from "./patient.model.js";
import { ApplicationError } from "../../errorhandler/applicationError.js";
import AppointmentModel from "../appointments/appointments.model.js";
import mongoose from "mongoose";
export default class PatientRepository {
  signUp = async (name, email, password) => {
    try {
      const existingPatient = await patientModel.findOne({ email });
      if (existingPatient) {
        const error = new Error("Email already exists");
        error.status = 400; // Set specific status for "bad request"
        throw error; // Throw the error to be handled later
      }
      const newPatient = await patientModel.create({
        name,
        email,
        password,
      });
      console.log(newPatient);
      return newPatient;
    } catch (error) {
      console.error("patient signup repo", error);
      throw error;
    }
  };
  async signIn(email, password) {
    try {
      return await patientModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findByEmail(email) {
    try {
      return await patientModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getUserById(userId) {
    try {
      return await patientModel.findById(userId).populate("appointments");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getFeedbackByPatientId(patientId) {
    try {
      return await patientModel
        .findById(patientId)
        .populate("feedbacks")
        .exec();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getPatientById(patientId) {
    const ObjectId = new mongoose.Types.ObjectId(patientId);
    try {
      return await patientModel.findOne({ _id: ObjectId });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAppointmentsByPatientId(patientId) {
    try {
      const patient = await patientModel
        .findById(patientId)
        .populate({
          path: "appointments", // Populate appointments
          populate: {
            path: "doctor", // Nested population for doctor inside each appointment
            select: "name email profileImageUrl", // Select fields to populate for the doctor
          },
        })
        .exec();
      patient.appointments.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      return patient.appointments;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
