import mongoose from "mongoose";

import patientModel from "./patient.model.js";
import { ApplicationError } from "../../errorhandler/applicationError.js";



export default class PatientRepository {
  signUp = async (name, email, password) => {
    try {
      const existingPatient = await patientModel.findOne({ email });
      if (existingPatient) {
        const error = new Error("Email already exists");
        error.status = 400; 
        throw error; 
      }
      const newPatient = await patientModel.create({
        name,
        email,
        password,
      });
      // console.log(newPatient);
      return newPatient;
    } catch (error) {
      // console.error("patient signup repo", error);
      throw error;
    }
  };
  async signIn(email, password) {
    try {
      return await patientModel.findOne({ email, password });
    } catch (err) {
      // console.log(err);
      throw err;
    }
  }

  async findByEmail(email) {
    try {
      return await patientModel.findOne({ email });
    } catch (err) {
      // console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getUserById(userId) {
    try {
      return await patientModel.findById(userId).populate("appointments");
    } catch (err) {
      // console.log(err);
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
      // console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getPatientById(patientId) {
    const ObjectId = new mongoose.Types.ObjectId(patientId);
    try {
      return await patientModel.findOne({ _id: ObjectId });
    } catch (err) {
      // console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAppointmentsByPatientId(patientId) {
    try {
      const patient = await patientModel
        .findById(patientId)
        .populate({
          path: "appointments", // populate appointments
          populate: {
            path: "doctor", // nested population for doctor inside each appointment
            select: "name email profileImageUrl", // select fields to populate for the doctor
          },
        })
        .exec();
        patient.appointments.sort((a, b) => {
          // first--compare by the date (ISO format)
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
        
          // if dates are different, return the comparison of the dates
          if (dateA !== dateB) {
            return dateA - dateB;
          }
        
          // if the dates are the same, compare by time
          const timeA = convertTo24HourFormat(a.timeSlot);
          const timeB = convertTo24HourFormat(b.timeSlot);
        
          return timeA - timeB;
        });
        
        function convertTo24HourFormat(timeSlot) {
          const [time, modifier] = timeSlot.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
        
          if (modifier === "PM" && hours !== 12) {
            hours += 12;
          } else if (modifier === "AM" && hours === 12) {
            hours = 0;
          }
        
          return hours * 60 + minutes;  
        }
        
      patient.appointments = patient.appointments.filter(
        (appointment) => appointment.status === "Confirmed"
      );
      // console.log("Patient APpointment",patient.appointments);
      return patient.appointments;
    } catch (err) {
      // console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  getAllPatientsForAdmin = async () => {
    try {
      return await patientModel.find();
    } catch (err) {
      // console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

}
