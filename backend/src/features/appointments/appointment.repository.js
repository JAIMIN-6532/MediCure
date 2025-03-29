import AppointmentModel from "./appointments.model.js";
import DoctorModel from "../doctor/doctor.model.js";
import PatientModel from "../patient/patient.model.js";
import PaymentModel from "../payment/payment.model.js";
import mongoose from "mongoose";
import { sendBookingConfirmationToPatient } from "../../utils/emails/bookingConfirmationPatient.js";
import { sendBookingConfirmationToDoctor } from "../../utils/emails/bookingConfirmationDoctor.js";
import { sendBookingCancelToPatient } from "../../utils/emails/bookingCancelPatient.js";
import { sendVideoCallLink } from "../../utils/emails/sendVideoCallLink.js";
export default class AppointmentRepository {
  bookAppointment = async (appointmentData, res, next) => {
    try {
      const {
        doctorId,
        patientId,
        paymentId,
        appointmentFees,
        paymentType,
        date,
        timeSlot,
        type,
      } = appointmentData;
      console.log("Appointment Data:", appointmentData);
      console.log("Appointment Data:", {
        doctorId,
        patientId,
        paymentId,
        date: new Date(date).toISOString(),
        timeSlot,
        type,
      });

      let parsedDate;
      if (typeof date === "string") {
        parsedDate = new Date(date);

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

      console.log("locked before", {
        doctorId,
        patientId,
        date: parsedDate,
        timeSlot,
        type,
      });

      // Check if there's a locked appointment
      const lockedAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        patient: patientId,
        timeSlot,
        status: { $eq: "Locked" },
      });

      console.log("Locked Appointment:", lockedAppointment);

      if (existingAppointment) {
        return "Appointment slot is already taken";
      }

      if (lockedAppointment) {
        if (paymentType === "Offline") {
        }
        const payment = await PaymentModel.findOne({ orderId: paymentId });
        console.log("Payment:", payment);
        let updatedAppointment;
        if (paymentType === "Online") {
          updatedAppointment = await AppointmentModel.updateOne(
            { _id: lockedAppointment._id },
            {
              $set: {
                status: "Confirmed",
                paymentId: payment._id,
                paymentType,
                type: appointmentData.type,
                appointmentFees,
              },
            }
          );
        } else {
          updatedAppointment = await AppointmentModel.updateOne(
            { _id: lockedAppointment._id },
            {
              $set: {
                status: "Confirmed",
                appointmentFees,
                paymentType,
              },
            }
          );
        }
        const finddoctor = await DoctorModel.findById(doctorId);
        const doctoremail = finddoctor.email;
        const findpatient = await PatientModel.findById(patientId);
        const patientemail = findpatient.email;

        const doctor = await DoctorModel.findByIdAndUpdate(
          doctorId,
          { $inc: { totalRevenue: appointmentFees } },
          { new: true }
        );

        await sendBookingConfirmationToPatient(
          patientemail,
          appointmentData,
          finddoctor.name
        );
        await sendBookingConfirmationToDoctor(
          doctoremail,
          appointmentData,
          findpatient.name
        );

        console.log(
          "Updated Locked Appointment to Confirmed:",
          updatedAppointment
        );

        return updatedAppointment;
      }
      const newAppointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId,
        date: parsedDate,
        timeSlot,
        type,
      });

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

      return newAppointment;
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

  cancelAppointment = async (appointmentId) => {
    try {
      const appointment = await AppointmentModel.findById(appointmentId);
      const cancelappointment = await AppointmentModel.deleteOne({
        _id: new mongoose.Types.ObjectId(appointmentId),
      });
      console.log("Cancel Appointment:", appointment);
      console.log("date", appointment.date);
      const updateDoctor = await DoctorModel.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(appointment.doctor),
        },
        {
          $pull: { appointments: new mongoose.Types.ObjectId(appointmentId) },
          $inc: { totalRevenue: -appointment.appointmentFees },
        },
        { new: true }
      );
      const updatePatient = await PatientModel.findByIdAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(appointment.patient),
        },
        {
          $pull: { appointments: new mongoose.Types.ObjectId(appointmentId) },
        },
        { new: true }
      );

      await sendBookingCancelToPatient(
        updatePatient.email,
        appointment,
        updateDoctor.name
      );

      return appointment;
    } catch (error) {
      console.error(error);
    }
  };

  sendVideoCallLinkMail = async (aid, link, patient) => {
    try {
      console.log("patient", patient);
      const sendMail = await sendVideoCallLink(patient, link);
      console.log("sendMail in Repo:", sendMail);
      return sendMail;
    } catch (err) {
      console.error(err);
    }
  };

  lockAppointment = async (appointmentData, res) => {
    console.log("Appointment Data for LOck:", appointmentData);
    const { doctorId, patientId, date, timeSlot } = appointmentData;

    try {
      let parsedDate;

      if (typeof date === "string") {
        parsedDate = new Date(date);
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

      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(parsedDate.getTime() + istOffset);

      console.log("Converted IST Date:", istDate);

      const existingLockedAppointment = await AppointmentModel.findOne({
        doctor: doctorId,
        date: istDate.toISOString(),
        timeSlot,
        status: "Locked",
      });

      if (existingLockedAppointment) {
        return res.status(200).json(existingLockedAppointment);
      }

      const lockedAppointment = await AppointmentModel.create({
        doctor: doctorId,
        patient: patientId,
        date: istDate,
        timeSlot,
        type: "Offline",
        status: "Locked",
      });

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

      const savedAppointment = await lockedAppointment.save();
      console.log("Saved Locked Appointment:", savedAppointment);
      return savedAppointment;
    } catch (error) {
      console.error(error);
    }
  };

  unlockAppointment = async (appointmentData) => {
    const { doctorId, patientId, date, timeSlot } = appointmentData;
    console.log("Appointment Data for Unlock:", appointmentData);
    try {
      let parsedDate;
      if (typeof date === "string") {
        parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
          return "Invalid date format provided";
        }
      } else if (date instanceof Date) {
        parsedDate = date;
      } else {
        return "Date is required and must be a valid date";
      }

      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(parsedDate.getTime() + istOffset);
      console.log("Converted IST Date:", istDate);

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

      return lockedAppointment;
    } catch (error) {
      console.error(error);
    }
  };

  getTotalRevenueByDoctorId = async (doctorId) => {
    try {
      const appointments = await AppointmentModel.find({
        doctor: doctorId,
        status: "Confirmed",
      });

      let totalRevenue = 0;
      appointments.forEach((appointment) => {
        totalRevenue += appointment.appointmentFees;
      });

      return totalRevenue;
    } catch (error) {
      console.error(error);
    }
  };
}
