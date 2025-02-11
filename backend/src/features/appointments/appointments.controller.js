import AppointmentRepository from "./appointment.repository.js";
import PatientRepository from "../patient/patient.repository.js";
import DoctorRepository from "../doctor/doctor.repository.js";
import DoctorModel from "../doctor/doctor.model.js";
import AppointmentModel from "./appointments.model.js";
import PatientModel from "../patient/patient.model.js";
import {
  format,
  addDays,
  startOfToday,
  getDay,
  isSameDay,
  parseISO,
} from "date-fns";
export default class AppointmentController {
  constructor() {
    this.appointmentRepository = new AppointmentRepository();
    this.patientRepository = new PatientRepository();
    this.doctorRepository = new DoctorRepository();
  }

  // Function to fetch available slots

  // getAvailableSlots = async (req, res) => {
  //   const { doctorId } = req.params;

  //   try {
  //     // Fetch the doctor data
  //     const doctor = await this.doctorRepository.getDoctorById(doctorId);

  //     if (!doctor) {
  //       return res.status(404).json({ message: "Doctor not found" });
  //     }

  //     // Fetch the doctor's availability
  //     const availability = doctor.availability;

  //     if (!availability || availability.length === 0) {
  //       return res.status(404).json({ message: "Doctor has no availability slots" });
  //     }

  //     // Fetch confirmed appointments for the doctor
  //     const appointments = await this.doctorRepository.getAppointmentsByDoctorId(doctorId);

  //     // Create a set of booked slots for the doctor (exact date and time)
  //     const bookedSlots = new Set(
  //       appointments
  //         .filter(appointment => appointment.status === 'Confirmed')  // Only confirmed appointments
  //         .map(appointment => {
  //           const appointmentDate = format(appointment.date, 'yyyy-MM-dd'); // Format the appointment date
  //           const timeSlot = appointment.timeSlot;
  //           return `${appointmentDate}-${timeSlot}`; // Combine date and timeSlot for exact matching
  //         })
  //     );

  //     console.log("Booked slots:", bookedSlots); // Debugging to check booked slots correctly

  //     // Now, process the doctor's availability and remove the booked slots
  //     const availableSlots = availability.map((day) => {
  //       // Get today's date (start of today)
  //       const today = startOfToday();

  //       // Find the index for the doctor's available day in the week (e.g., Mon, Tue, etc.)
  //       const dayOfWeekIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day.day);
  //       if (dayOfWeekIndex === -1) {
  //         return null; // Invalid day, ignore it
  //       }

  //       const currentDayIndex = new Date().getDay();
  //       let daysToAdd = dayOfWeekIndex - currentDayIndex;
  //       if (daysToAdd <= 0) {
  //         daysToAdd += 7; // Move to the next occurrence of the same weekday
  //       }

  //       // Calculate the next available date for this day
  //       const nextAvailableDate = addDays(today, daysToAdd);
  //       const formattedDate = format(nextAvailableDate, 'yyyy-MM-dd'); // Format the next available date

  //       console.log("Next Available Date:", formattedDate); // Debugging to check if the date is correct

  //       // Now, filter out the booked slots for this day
  //       const availableDaySlots = day.slots.filter((slot) => {
  //         const slotIdentifier = `${formattedDate}-${slot}`;
  //         return !bookedSlots.has(slotIdentifier); // Remove if the slot is booked
  //       });

  //       // If there are available slots left for this day, return them
  //       if (availableDaySlots.length > 0) {
  //         return {
  //           date: formattedDate,
  //           availableSlots: availableDaySlots,
  //         };
  //       } else {
  //         return null; // No available slots for this day
  //       }
  //     }).filter(day => day !== null); // Filter out days with no available slots

  //     console.log("Available slots:", availableSlots); // Debugging to check the available slots after filtering

  //     // Return the available slots
  //     return res.json({ availableSlots });
  //   } catch (error) {
  //     console.error("Error fetching available slots:", error);
  //     return res.status(500).json({ message: "Error fetching available slots", error: error.message });
  //   }
  // };

  // getAvailableSlots = async (req, res) => {
  //   const { doctorId } = req.params;

  //   try {
  //     // Fetch the doctor data
  //     const doctor = await this.doctorRepository.getDoctorById(doctorId);

  //     if (!doctor) {
  //       return res.status(404).json({ message: "Doctor not found" });
  //     }

  //     // Fetch the doctor's availability
  //     const availability = doctor.availability;

  //     if (!availability || availability.length === 0) {
  //       return res.status(404).json({ message: "Doctor has no availability slots" });
  //     }

  //     // Fetch confirmed appointments for the doctor
  //     const appointments = await this.doctorRepository.getAppointmentsByDoctorId(doctorId);

  //     // Create a set of booked slots for the doctor (date-time pair)
  //     const bookedSlots = new Set(
  //       appointments
  //         .filter(appointment => appointment.status === 'Confirmed')  // Only confirmed appointments
  //         .map(appointment => {
  //           const appointmentDate = appointment.date; // Keep the exact date-time of the appointment
  //           const timeSlot = appointment.timeSlot;

  //           // Combine the appointment date and time slot into a unique identifier
  //           const slotIdentifier = `${appointmentDate.toISOString()}-${timeSlot}`;
  //           return slotIdentifier;
  //         })
  //     );

  //     console.log("Booked slots:", bookedSlots); // Debugging to check booked slots correctly

  //     // Now, process the doctor's availability and remove the booked slots
  //     const availableSlots = availability.map((day) => {
  //       // Get today's date (start of today)
  //       const today = startOfToday();

  //       // Find the index for the doctor's available day in the week (e.g., Mon, Tue, etc.)
  //       const dayOfWeekIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day.day);
  //       if (dayOfWeekIndex === -1) {
  //         return null; // Invalid day, ignore it
  //       }

  //       const currentDayIndex = new Date().getDay();
  //       let daysToAdd = dayOfWeekIndex - currentDayIndex;
  //       if (daysToAdd <= 0) {
  //         daysToAdd += 7; // Move to the next occurrence of the same weekday
  //       }

  //       // Calculate the next available date for this day
  //       const nextAvailableDate = addDays(today, daysToAdd);
  //       const formattedDate = format(nextAvailableDate, 'yyyy-MM-dd'); // Format the next available date

  //       console.log("Next Available Date:", formattedDate); // Debugging to check if the date is correct

  //       // Now, filter out the booked slots for this day
  //       const availableDaySlots = day.slots.filter((slot) => {
  //         const slotIdentifier = `${formattedDate}T00:00:00.000Z-${slot}`; // Ensure that the time component matches the available slot
  //         return !bookedSlots.has(slotIdentifier); // Remove if the slot is booked
  //       });

  //       // If there are available slots left for this day, return them
  //       if (availableDaySlots.length > 0) {
  //         return {
  //           date: formattedDate,
  //           availableSlots: availableDaySlots,
  //         };
  //       } else {
  //         return null; // No available slots for this day
  //       }
  //     }).filter(day => day !== null); // Filter out days with no available slots

  //     console.log("Available slots after filtering:", availableSlots); // Debugging to check the available slots after filtering

  //     // Return the available slots
  //     return res.json({ availableSlots });
  //   } catch (error) {
  //     console.error("Error fetching available slots:", error);
  //     return res.status(500).json({ message: "Error fetching available slots", error: error.message });
  //   }
  // };

  separateDateAndTime(slot) {
    // Split the input string based on the last '-' (to correctly separate date and time)
    const parts = slot.split("-");

    // Ensure there are enough parts to separate date and time
    if (parts.length < 2) {
      throw new Error("Invalid slot format. Could not extract date and time.");
    }

    // The first part is the date (e.g., '2025-01-01')
    const dateString = parts.slice(0, 3).join("-"); // Joining date parts back (e.g., '2025-01-01')
    // The remaining part is the time (e.g., '01:00 AM')
    const time = parts.slice(3).join(" "); // Joining time parts back (e.g., '01:00 AM')

    // Parse the date part
    const dateObj = new Date(dateString);

    // Ensure the date is valid
    if (isNaN(dateObj)) {
      throw new Error("Invalid date format");
    }

    // Extract the date in 'YYYY-MM-DD' format
    const date = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    return { date, time };
  }

  // getAvailableSlots = async (req, res) => {
  //   const { doctorId } = req.params;

  //   try {
  //     // Fetch the doctor data
  //     const doctor = await this.doctorRepository.getDoctorById(doctorId);

  //     if (!doctor) {
  //       return res.status(404).json({ message: "Doctor not found" });
  //     }

  //     // Fetch the doctor's availability
  //     const availability = doctor.availability;

  //     if (!availability || availability.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ message: "Doctor has no availability slots" });
  //     }

  //     // Fetch confirmed and locked appointments for the doctor
  //     const appointments =
  //       await this.doctorRepository.getAppointmentsByDoctorId(doctorId);

  //     // Create a set of booked slots for the doctor (date-time pair) based on the date and time
  //     const bookedSlots = new Set(
  //       appointments
  //         .filter(
  //           (appointment) =>
  //             appointment.status === "Confirmed" || appointment.status === "Locked"
  //         ) // Exclude both locked and confirmed appointments
  //         .map((appointment) => {
  //           const appointmentDate = appointment.date;
  //           const timeSlot = appointment.timeSlot;

  //           // Format the booked slot as 'YYYY-MM-DD-hh:mm AM/PM'
  //           const slotIdentifier = `${
  //             appointmentDate.toISOString().split("T")[0]
  //           }-${timeSlot}`;
  //           return slotIdentifier;
  //         })
  //     );

  //     console.log("Booked slots:", bookedSlots); // Debugging to check booked slots correctly

  //     // Now, process the doctor's availability and remove the booked slots
  //     const availableSlots = availability
  //       .map((day) => {
  //         // Get today's date (start of today)
  //         const today = startOfToday(); // Ensure it's at the start of today

  //         // Find the index for the doctor's available day in the week (e.g., Mon, Tue, etc.)
  //         const dayOfWeekIndex = [
  //           "Sun",
  //           "Mon",
  //           "Tue",
  //           "Wed",
  //           "Thu",
  //           "Fri",
  //           "Sat",
  //         ].indexOf(day.day);
  //         if (dayOfWeekIndex === -1) {
  //           return null; // Invalid day, ignore it
  //         }

  //         const currentDayIndex = new Date().getDay();
  //         let daysToAdd = dayOfWeekIndex - currentDayIndex;

  //         // If the daysToAdd is less than or equal to 0, it means the desired day is later in the week
  //         if (daysToAdd <= 0) {
  //           daysToAdd += 7; // Move to the next occurrence of the same weekday
  //         }

  //         // Calculate the next available date for this day
  //         const nextAvailableDate = addDays(today, daysToAdd);
  //         const formattedDate = format(nextAvailableDate, "yyyy-MM-dd"); // Format the next available date to yyyy-MM-dd

  //         console.log("Next Available Date:", formattedDate); // Debugging to check if the date is correct

  //         // Now, filter out the booked slots for this day based on the time only
  //         const availableDaySlots = day.slots.filter((slot) => {
  //           const slotIdentifier = `${formattedDate}-${slot}`; // Combine date and time slot
  //           return !bookedSlots.has(slotIdentifier); // Remove if the slot is booked
  //         });

  //         // If today is the same day of the week as the available day, include today's slots
  //         const isToday = currentDayIndex === dayOfWeekIndex;
  //         const formattedToday = format(today, "yyyy-MM-dd"); // Format today's date

  //         if (isToday) {
  //           const availableTodaySlots = day.slots.filter((slot) => {
  //             const slotIdentifier = `${formattedToday}-${slot}`;
  //             return !bookedSlots.has(slotIdentifier); // Remove if the slot is booked
  //           });

  //           if (availableTodaySlots.length > 0) {
  //             return {
  //               date: formattedToday,
  //               availableSlots: availableTodaySlots,
  //             };
  //           }
  //         }

  //         // Return the next available date if no slots for today
  //         if (availableDaySlots.length > 0) {
  //           return {
  //             date: formattedDate,
  //             availableSlots: availableDaySlots,
  //           };
  //         } else {
  //           return null; // No available slots for this day
  //         }
  //       })
  //       .filter((day) => day !== null); // Filter out days with no available slots

  //     console.log("Available slots after filtering:", availableSlots); // Debugging to check the available slots after filtering

  //     // Return the available slots
  //     return res.json({ availableSlots });
  //   } catch (error) {
  //     console.error("Error fetching available slots:", error);
  //     return res
  //       .status(500)
  //       .json({
  //         message: "Error fetching available slots",
  //         error: error.message,
  //       });
  //   }
  // };

  getAvailableSlots = async (req, res) => {
    const { doctorId } = req.params;

    try {
      // Fetch the doctor data
      const doctor = await this.doctorRepository.getDoctorById(doctorId);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Fetch the doctor's availability
      const availability = doctor.availability;

      if (!availability || availability.length === 0) {
        return res
          .status(404)
          .json({ message: "Doctor has no availability slots" });
      }

      // Fetch confirmed appointments for the doctor
      const appointments =
        await this.doctorRepository.getAppointmentsByDoctorId(doctorId);

      // Create a set of booked slots for the doctor (date-time pair) based on the date and time
      const bookedSlots = new Set(
        appointments
          .filter(
            (appointment) =>
              appointment.status === "Confirmed" ||
              appointment.status === "Locked"
          ) // Only confirmed appointments
          .map((appointment) => {
            const appointmentDate = appointment.date;
            const timeSlot = appointment.timeSlot;

            // Format the booked slot as 'YYYY-MM-DD-hh:mm AM/PM'
            const slotIdentifier = `${
              appointmentDate.toISOString().split("T")[0]
            }-${timeSlot}`;
            return slotIdentifier;
          })
      );

      console.log("Booked slots:", bookedSlots); // Debugging to check booked slots correctly

      // Now, process the doctor's availability and remove the booked slots
      const availableSlots = availability
        .map((day) => {
          // Get today's date (start of today)
          const today = startOfToday(); // Ensure it's at the start of today

          // Find the index for the doctor's available day in the week (e.g., Mon, Tue, etc.)
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
            return null; // Invalid day, ignore it
          }

          const currentDayIndex = new Date().getDay();
          let daysToAdd = dayOfWeekIndex - currentDayIndex;

          // If the daysToAdd is less than or equal to 0, it means the desired day is later in the week
          if (daysToAdd <= 0) {
            daysToAdd += 7; // Move to the next occurrence of the same weekday
          }

          // Calculate the next available date for this day
          const nextAvailableDate = addDays(today, daysToAdd);
          const formattedDate = format(nextAvailableDate, "yyyy-MM-dd"); // Format the next available date to yyyy-MM-dd

          console.log("Next Available Date:", formattedDate); // Debugging to check if the date is correct

          // Now, filter out the booked slots for this day based on the time only
          const availableDaySlots = day.slots.filter((slot) => {
            const slotIdentifier = `${formattedDate}-${slot}`; // Combine date and time slot
            return !bookedSlots.has(slotIdentifier); // Remove if the slot is booked
          });

          // If today is the same day of the week as the available day, include today's slots
          const isToday = currentDayIndex === dayOfWeekIndex;
          const formattedToday = format(today, "yyyy-MM-dd"); // Format today's date

          if (isToday) {
            const availableTodaySlots = day.slots.filter((slot) => {
              const slotIdentifier = `${formattedToday}-${slot}`;
              return !bookedSlots.has(slotIdentifier); // Remove if the slot is booked
            });

            if (availableTodaySlots.length > 0) {
              return {
                date: formattedToday,
                availableSlots: availableTodaySlots,
              };
            }
          }

          // Return the next available date if no slots for today
          if (availableDaySlots.length > 0) {
            return {
              date: formattedDate,
              availableSlots: availableDaySlots,
            };
          } else {
            return null; // No available slots for this day
          }
        })
        .filter((day) => day !== null); // Filter out days with no available slots

      console.log("Available slots after filtering:", availableSlots); // Debugging to check the available slots after filtering

      // Return the available slots
      return res.json({ availableSlots });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      return res.status(500).json({
        message: "Error fetching available slots",
        error: error.message,
      });
    }
  };

  // Function to book an appointment
  bookAppointment = async (req, res, next) => {
    //   const { doctorId,patientId ,date, timeSlot } = req.body;

    try {
      const newAppointment = await this.appointmentRepository.bookAppointment(
        req.body,
        res
      );

      //   console.log(req.user);
      //   const patientId = req.user.userID // Get the patient ID from the logged-in user

      return res
        .status(201)
        .json({ message: "Appointment booked successfully", newAppointment });
    } catch (error) {
      console.error(error);
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
      console.error(error);
      return res.status(500).json({ message: "Error cancelling appointment" });
    }
  };

  sendVideoCallLinkMail = async (req, res, next) => {
    try {
      const aid = req.params.aid;
      const { patient } = req.body;
      const link = `http://localhost:5173/room/${aid}`;
      const sendMail = await this.appointmentRepository.sendVideoCallLinkMail(
        aid,
        link,
        patient
      );
      console.log("sendMail", sendMail);
      // if(sendMail){
      return res
        .status(200)
        .json({ message: "Email sent successfully", success: true });
      // }
      // return res.status(500).json({ message: "Error sending email" , success: false});
    } catch (err) {
      console.error(err);
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
      console.error(error);
      return res.status(500).json({ message: "Error getting appointment" });
    }
  };

  lockAppointment = async (req) => {
    // const { doctorId, patientId, date, timeSlot  } = req.body;
    // console.log("req.body", req);
    try {
      const Lockappointment = await this.appointmentRepository.lockAppointment(
        req
      );
      return Lockappointment;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error locking appointment" });
    }
  };

  unlockAppointment = async (req) => {
    // const { doctorId, patientId, date, timeSlot  } = req.body;
    console.log("req.body", req);
    try {
      const Unlockappointment =
        await this.appointmentRepository.unlockAppointment(req);
      return Unlockappointment;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error unlocking appointment" });
    }
  };

  getTotalRevenueByDoctorId = async (doctorId) => {
    try {
      const totalRevenue =
        await this.appointmentRepository.getTotalRevenueByDoctorId(doctorId);
      return totalRevenue;
    } catch (error) {
      console.error(error);
      return error;
      // return res.status(500).json({ message: "Error getting total revenue" });
    }
  };
}
