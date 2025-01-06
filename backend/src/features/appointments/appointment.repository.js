import AppointmentModel from "./appointments.model.js";
import DoctorModel from "../doctor/doctor.model.js";
import PatientModel from "../patient/patient.model.js";
export default class AppointmentRepository{

    bookAppointment = async (appointmentData) => {
        try {
            const { doctorId, patientId, date, timeSlot } = appointmentData;
            // Check if the appointment slot is already taken
            const existingAppointment = await AppointmentModel.findOne({ doctor: doctorId, date, timeSlot });
        
            if (existingAppointment) {
              return res.status(400).json({ message: "The selected slot is already booked" });
            }
        
            // Create a new appointment using `create()`
            const appointment = await AppointmentModel.create({
              doctor: doctorId,
              patient: patientId, // You would normally get this from the logged-in patient
              date,
              timeSlot,
              status: 'Pending',  // Default status is "Pending"
            });
        
            await DoctorModel.findByIdAndUpdate(
                doctorId,
                { $push: { appointments: appointment._id } },  // Add the new appointment ID to the doctor's appointments array
                { new: true }
              );
          
              // Update the patient's appointments array
              await PatientModel.findByIdAndUpdate(
                patientId,
                { $push: { appointments: appointment._id } },  // Add the new appointment ID to the patient's appointments array
                { new: true }
              );
        
            return appointment;
          } catch (error) {
            console.error(error);
            
          }
    }
    

}