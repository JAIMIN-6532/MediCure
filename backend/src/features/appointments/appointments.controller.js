import {
  format,
  addDays,
  startOfToday,
  getDay,
  isSameDay,
  parseISO,
} from "date-fns";

import AppointmentRepository from "./appointment.repository.js";
import PatientRepository from "../patient/patient.repository.js";
import DoctorRepository from "../doctor/doctor.repository.js";

export default class AppointmentController {
  constructor() {
    this.appointmentRepository = new AppointmentRepository();
    this.patientRepository = new PatientRepository();
    this.doctorRepository = new DoctorRepository();
  }

  separateDateAndTime(slot) {
    const parts = slot.split("-");

    if (parts.length < 2) {
      throw new Error("Invalid slot format. Could not extract date and time.");
    }

    const dateString = parts.slice(0, 3).join("-");
    const time = parts.slice(3).join(" ");
    const dateObj = new Date(dateString);

    if (isNaN(dateObj)) {
      throw new Error("Invalid date format");
    }

    const date = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    return { date, time };
  }

  getAvailableSlots = async (req, res) => {
    const { doctorId } = req.params;

    try {
      const doctor = await this.doctorRepository.getDoctorById(doctorId);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const availability = doctor.availability;

      if (!availability || availability.length === 0) {
        return res
          .status(404)
          .json({ message: "Doctor has no availability slots" });
      }

      const appointments =
        await this.doctorRepository.getAppointmentsByDoctorId(doctorId);

      const bookedSlots = new Set(
        appointments
          .filter(
            (appointment) =>
              appointment.status === "Confirmed" ||
              appointment.status === "Locked"
          )
          .map((appointment) => {
            const appointmentDate = appointment.date;
            const timeSlot = appointment.timeSlot;

            const slotIdentifier = `${
              appointmentDate.toISOString().split("T")[0]
            }-${timeSlot}`;
            return slotIdentifier;
          })
      );

      // console.log("Booked slots:", bookedSlots);
      const availableSlots = availability
        .map((day) => {
          const today = startOfToday();

          // find the index for the doctor's available day in the week (e.g., Mon, Tue, etc.)
          const dayOfWeekIndex = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].indexOf(day.day);
          if (dayOfWeekIndex === -1) {
            return null;
          }

          const currentDayIndex = new Date().getDay();
          let daysToAdd = dayOfWeekIndex - currentDayIndex;

          if (daysToAdd <= 0) {
            daysToAdd += 7;
          }

          const nextAvailableDate = addDays(today, daysToAdd);
          const formattedDate = format(nextAvailableDate, "yyyy-MM-dd");
          // console.log("Next Available Date:", formattedDate);
          const availableDaySlots = day.slots.filter((slot) => {
            const slotIdentifier = `${formattedDate}-${slot}`;
            return !bookedSlots.has(slotIdentifier);
          });

          const isToday = currentDayIndex === dayOfWeekIndex;
          const formattedToday = format(today, "yyyy-MM-dd");

          if (isToday) {
            const availableTodaySlots = day.slots.filter((slot) => {
              const slotIdentifier = `${formattedToday}-${slot}`;
              return !bookedSlots.has(slotIdentifier);
            });

            if (availableTodaySlots.length > 0) {
              return {
                date: formattedToday,
                availableSlots: availableTodaySlots,
              };
            }
          }

          if (availableDaySlots.length > 0) {
            return {
              date: formattedDate,
              availableSlots: availableDaySlots,
            };
          } else {
            return null;
          }
        })
        .filter((day) => day !== null);

      // console.log("Available slots after filtering:", availableSlots);
      return res.json({ availableSlots });
    } catch (error) {
      // console.error("Error fetching available slots:", error);
      return res.status(500).json({
        message: "Error fetching available slots",
        error: error.message,
      });
    }
  };

  bookAppointment = async (req, res, next) => {
    try {
      const newAppointment = await this.appointmentRepository.bookAppointment(
        req.body,
        res
      );
      return res
        .status(201)
        .json({ message: "Appointment booked successfully", newAppointment });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error booking appointment" });
    }
  };

  cancelAppointment = async (req, res, next) => {
    try {
      const aid = req.params.aid;
      const appointment = await this.appointmentRepository.cancelAppointment(
        aid
      );

      return res
        .status(200)
        .json({ appointment, message: "Appointment cancelled" });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error cancelling appointment" });
    }
  };

  sendVideoCallLinkMail = async (req, res, next) => {
    try {
      const aid = req.params.aid;
      const { patient } = req.body;
      const link = `https://www.medicure.help/room/${aid}`;
      const sendMail = await this.appointmentRepository.sendVideoCallLinkMail(
        aid,
        link,
        patient
      );
      return res
        .status(200)
        .json({ message: "Email sent successfully", success: true });
    } catch (err) {
      // console.error(err);
      return res
        .status(500)
        .json({ message: "Error sending email", success: false });
    }
  };

  getAppointmentByAId = async (req, res, next) => {
    try {
      const appointment = await this.appointmentRepository.getAppointmentByAId(
        req.params.aid
      );
      if (appointment === null) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      return res.status(200).json({ appointment });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error getting appointment" });
    }
  };

  lockAppointment = async (req) => {
    try {
      const Lockappointment = await this.appointmentRepository.lockAppointment(
        req
      );
      return Lockappointment;
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error locking appointment" });
    }
  };

  unlockAppointment = async (req) => {
    // console.log("req.body", req);
    try {
      const Unlockappointment =
        await this.appointmentRepository.unlockAppointment(req);
      return Unlockappointment;
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error unlocking appointment" });
    }
  };

  getTotalRevenueByDoctorId = async (doctorId) => {
    try {
      const totalRevenue =
        await this.appointmentRepository.getTotalRevenueByDoctorId(doctorId);
      return totalRevenue;
    } catch (error) {
      // console.error(error);
      return error;
    }
  };
}
