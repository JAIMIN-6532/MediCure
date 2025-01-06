import AppointmentRepository from "./appointment.repository.js";
import PatientRepository from "../patient/patient.repository.js";
import DoctorRepository from "../doctor/doctor.repository.js";
import DoctorModel from "../doctor/doctor.model.js";
import AppointmentModel from "./appointments.model.js";
import PatientModel from "../patient/patient.model.js";
export default class AppointmentController {

    constructor(){
        this.appointmentRepository = new AppointmentRepository();
        this.patientRepository = new PatientRepository();
        this.doctorRepository = new DoctorRepository();
    }

// Function to fetch available slots
 getAvailableSlots = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Find the doctor by ID
    const doctor = await DoctorRepository.findById(doctorId); /////////////

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get the availability of the doctor
    const availability = doctor.availability;

    if (!availability) {
      return res.status(404).json({ message: "Doctor has no availability slots" });
    }

    return res.json({ availability });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching doctor's availability" });
  }
};

// Function to book an appointment
 bookAppointment = async (req, res,next) => {
//   const { doctorId,patientId ,date, timeSlot } = req.body;

  try{

   const newAppointment = await this.appointmentRepository.bookAppointment(req.body);
  

//   console.log(req.user);
//   const patientId = req.user.userID // Get the patient ID from the logged-in user

    return res.status(201).json({ message: "Appointment booked successfully", newAppointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error booking appointment" });
  }
};

}