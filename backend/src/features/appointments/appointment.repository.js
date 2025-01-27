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
        date: new Date(date).toISOString(),
        timeSlot,
        type,
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

      console.log("locked before",{doctorId,
        patientId,
        date: parsedDate,
        timeSlot,
        type,});
  
      // Check if there's a locked appointment
      const lockedAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        patient: patientId,    //compare date also remaining
        timeSlot,
        status: { $eq: "Locked" },
      });
  
      console.log("Locked Appointment:", lockedAppointment);
  
      if (existingAppointment) {
        return "Appointment slot is already taken"; // Slot is already confirmed
      }
  
      if (lockedAppointment) {
        // Update the locked appointment to confirmed status
        const updatedAppointment = await AppointmentModel.updateOne(
          { _id: lockedAppointment._id },
          { $set: { status: "Confirmed" } }
        );
  
        console.log("Updated Locked Appointment to Confirmed:", updatedAppointment);
  
        return updatedAppointment; // Return the updated appointment
      }
  
      // If no locked appointment, create a new appointment
      const newAppointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId,
        date: parsedDate,
        timeSlot,
        type,
      });
  
      // Update doctor's and patient's appointments array
      await DoctorModel.findByIdAndUpdate(
        doctorId,
        { $push: { appointments: newAppointment._id } },
        { new: true }
      );
  
      await PatientModel.findByIdAndUpdate(
        patientId,
        { $push: { appointments: newAppointment._id } },
        { new: true }
      );
  
      console.log("New Appointment Booked:", newAppointment);
  
      return newAppointment; // Return the newly created appointment
    } catch (error) {
      console.error("Error booking appointment:", error);
      return "Error booking appointment: " + error.message;
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

   lockAppointment = async (appointmentData, res) => {
    console.log("Appointment Data:", appointmentData);
    const { doctorId, patientId, date, timeSlot } = appointmentData;
  
    try {
      let parsedDate;
  
      // Handle the date input
      if (typeof date === "string") {
        parsedDate = new Date(date); // This will create a Date object in UTC if the date is valid string
  
        // Validate the date
        if (isNaN(parsedDate)) {
          return res
            .status(400)
            .json({ message: "Invalid date format provided" });
        }
      } else if (date instanceof Date) {
        parsedDate = date; // If the date is already a Date object
      } else {
        return res
          .status(400)
          .json({ message: "Date is required and must be a valid date" });
      }
  
      // Convert the parsedDate to IST (UTC + 5:30 hours)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
      const istDate = new Date(parsedDate.getTime() + istOffset); // Adjust date to IST time
  
      // The `istDate` is now in IST (Indian Standard Time)
      console.log("Converted IST Date:", istDate); // This will be in IST time
  
      // Check if there's already a locked appointment for this time slot in IST
      const existingLockedAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        date: istDate.toISOString(), // Use IST date for matching
        timeSlot,
        status: "Locked",
      });
  
      if (existingLockedAppointment) {
        // Return existing locked appointment if already locked
        return res.status(200).json(existingLockedAppointment);
      }
  
      // Create a new locked appointment (storing in IST)
      const lockedAppointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId,
        date: istDate, // Store the IST date
        timeSlot,
        type: "Offline",
        status: "Locked",
      });
  
      // Update doctor's and patient's appointments arrays with the locked appointment
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
  
      // Save the locked appointment
      const savedAppointment = await lockedAppointment.save();
      return savedAppointment;
    } catch (error) {
      console.error(error);
      // return res.status(500).json({ message: "Internal server error" });
    }
  };

  unlockAppointment = async (appointmentData) => {
    const { doctorId, patientId, date, timeSlot } = appointmentData;
    try {
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

      const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
      const istDate = new Date(parsedDate.getTime() + istOffset); // Adjust date to IST time
  
      console.log("Converted IST Date:", istDate); // This will be in IST time

      const lockedAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        date: istDate.toISOString(),
        timeSlot,
        patient: patientId,
        status: "Locked",
      });

      if (!lockedAppointment) {
        return "No locked appointment found";
      }

      // Delete the locked appointment
      const deletedAppointment = await AppointmentModel.deleteOne({
        _id: lockedAppointment._id,
      });

      const doctor = await DoctorModel.findByIdAndUpdate(
        doctorId,
        { $pull: { appointments: lockedAppointment._id } },
        { new: true }
      );

      const patient = await PatientModel.findByIdAndUpdate(
        patientId,
        { $pull: { appointments: lockedAppointment._id } },
        { new: true }
      );


      return lockedAppointment; // Return the deleted appointment 
    } catch (error) {
      console.error(error);
    }
  }

}
