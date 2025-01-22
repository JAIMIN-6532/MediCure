import AppointmentModel from "./appointments.model.js";
import DoctorModel from "../doctor/doctor.model.js";
import PatientModel from "../patient/patient.model.js";
import mongoose from "mongoose";
export default class AppointmentRepository {
  // bookAppointment = async (appointmentData, res, next) => {
  //   try {
  //     const { doctorId, patientId, date, timeSlot } = appointmentData;

  //     console.log("appointmentData", appointmentData);
  //     let parsedDate;
  //     if (!(appointmentData.date instanceof Date)) {
  //       parsedDate = new Date(appointmentData.date); // If it's not a Date, convert it to a Date object
  //     } else {
  //       parsedDate = appointmentData.date; // If it is already a Date, use it as is
  //     }
  //     // Check if the appointment slot is already taken
  //     const existingAppointment = await AppointmentModel.findOne({
  //       doctor: doctorId,
  //       date: parsedDate,
  //       timeSlot,
  //     });

  //     if (existingAppointment) {
  //       return res
  //         .status(400)
  //         .json({ message: "Appointment slot is already taken" });
  //     }

  //     // Create a new appointment using `create()`
  //     const appointment = await AppointmentModel.create({
  //       doctor: doctorId,
  //       patient: patientId, // You would normally get this from the logged-in patient
  //       date: parsedDate,
  //       timeSlot,
  //     });

  //     await DoctorModel.findByIdAndUpdate(
  //       doctorId,
  //       { $push: { appointments: appointment._id } }, // Add the new appointment ID to the doctor's appointments array
  //       { new: true }
  //     );

  //     // Update the patient's appointments array
  //     await PatientModel.findByIdAndUpdate(
  //       patientId,
  //       { $push: { appointments: appointment._id } }, // Add the new appointment ID to the patient's appointments array
  //       { new: true }
  //     );

  //     return appointment;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  bookAppointment = async (appointmentData, res, next) => {
    try {
      const { doctorId, patientId, date, timeSlot, type } = appointmentData;
      console.log("Appointment Data:", appointmentData);
      console.log("Appointment Data:", {
        doctorId,
        patientId,
        date: new Date(date).toISOString(), // Standard ISO format for date
        timeSlot,
        type: type,
      });

      let parsedDate;
      if (typeof date === "string") {
        parsedDate = new Date(date);

        // Validate the date
        if (isNaN(parsedDate)) {
          return "Invalid date format provided";
        }
      } else if (date instanceof Date) {
        parsedDate = date;
      } else {
        return "Date is required and must be a valid date";
      }

      // Check if the appointment slot is already taken
      const existingAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        date: parsedDate,
        timeSlot,
        status: { $eq: "Confirmed" },
      });

      const lockedAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        date: parsedDate,
        timeSlot,
        status: { $eq: "Locked" },
      });

      if (existingAppointment) {
        // return res.status(400).json({ message: "Appointment slot is already taken" });
        return "Appointment slot is already taken";
      }

      if(lockedAppointment){
       const appointment =  await AppointmentModel.updateOne(
          { _id: lockedAppointment._id },
          { $set: { status: "Confirmed" } }
        );
        await appointment.save();
        return appointment;
      }

      // Create a new appointment
      const appointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId, // This would normally be fetched from the logged-in user
        date: parsedDate,
        timeSlot,
        type,
      });

      // Update doctor's and patient's appointments array
      await DoctorModel.findByIdAndUpdate(
        doctorId,
        { $push: { appointments: appointment._id } },
        { new: true }
      );

      await PatientModel.findByIdAndUpdate(
        patientId,
        { $push: { appointments: appointment._id } },
        { new: true }
      );

      // Send success response (only one response per request)
      // if (!res.headersSent) {
      //   return res.status(200).json({
      //     message: "Appointment booked successfully",
      //     appointment,
      //   });
      // }
      return appointment;
    } catch (error) {
      console.error("Error booking appointment:", error);

      // Ensure only one response is sent in case of an error
      // if (!res.headersSent) {
      //   return res.status(500).json({
      //     message: "Error booking appointment",
      //     error: error.message,
      //   });
      // }
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

  lockAppointment = async (appointmentData) => {
    const { doctorId, patientId, date, timeSlot } = appointmentData;
    try {
      let parsedDate;
      if (typeof date === "string") {
        parsedDate = new Date(date);

        // Validate the date
        if (isNaN(parsedDate)) {
          return res
            .status(400)
            .json({ message: "Invalid date format provided" });
        }
      } else if (date instanceof Date) {
        parsedDate = date;
      } else {
        return res
          .status(400)
          .json({ message: "Date is required and must be a valid date" });
      }
      const lockedAppointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId,
        date: parsedDate,
        timeSlot,
        type: "Offline",
        status: "Locked",
      });
      // Update doctor's and patient's appointments array
      await DoctorModel.findByIdAndUpdate(
        doctorId,
        { $push: { appointments: lockedAppointment._id } },
        { new: true }
      );

      await PatientModel.findByIdAndUpdate(
        patientId,
        { $push: { appointments: lockedAppointment._id } },
        { new: true }
      );
      const lockAppointment = await lockedAppointment.save();
      return lockAppointment;
    } catch (error) {
      console.error(error);
    }
  };
}
