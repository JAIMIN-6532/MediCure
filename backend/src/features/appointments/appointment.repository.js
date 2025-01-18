import AppointmentModel from "./appointments.model.js";
import DoctorModel from "../doctor/doctor.model.js";
import PatientModel from "../patient/patient.model.js";
import mongoose from "mongoose";
import e from "express";
export default class AppointmentRepository {
  bookAppointment = async (appointmentData, res, next) => {
    try {
      const { doctorId, patientId, date, timeSlot } = appointmentData;
      console.log("appointmentData", appointmentData);
      let parsedDate;
      if (!(appointmentData.date instanceof Date)) {
        parsedDate = new Date(appointmentData.date); // If it's not a Date, convert it to a Date object
      } else {
        parsedDate = appointmentData.date; // If it is already a Date, use it as is
      }
      // Check if the appointment slot is already taken
      const existingAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        date: parsedDate,
        timeSlot,
      });

      if (existingAppointment) {
        return res
          .status(400)
          .json({ message: "Appointment slot is already taken" });
      }

      // Create a new appointment using `create()`
      const appointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId, // You would normally get this from the logged-in patient
        date: parsedDate,
        timeSlot,
      });

      await DoctorModel.findByIdAndUpdate(
        doctorId,
        { $push: { appointments: appointment._id } }, // Add the new appointment ID to the doctor's appointments array
        { new: true }
      );

      // Update the patient's appointments array
      await PatientModel.findByIdAndUpdate(
        patientId,
        { $push: { appointments: appointment._id } }, // Add the new appointment ID to the patient's appointments array
        { new: true }
      );

      return appointment;
    } catch (error) {
      console.error(error);
    }
  };

  getAppointmentByAId = async (id) => {
    try {
      const appointment = await AppointmentModel.findById(id);
      return appointment;
    } catch (error) {
      console.error(error);
    }
  };
}
