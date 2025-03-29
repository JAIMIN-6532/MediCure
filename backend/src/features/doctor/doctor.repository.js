import mongoose from "mongoose";
import DoctorModel from "./doctor.model.js";
import PatientModel from "../patient/patient.model.js";
import AppointmentModel from "../appointments/appointments.model.js";
import moment from "moment-timezone";
export default class DoctorRepository {
  signUp = async ({ name, email, password }) => {
    try {
      const existingDoctor = await DoctorModel.findOne({ email });
      if (existingDoctor) {
        const error = new Error("DoctorEmail already exists");
        error.status = 400; 
        throw error; 
      }

      const newDoctor = await DoctorModel.create({
        name,
        email,
        password,
      });
      console.log(newDoctor);
      return newDoctor;
    } catch (err) {
      console.log("doctor signup repo", err);
      throw err;
    }
  };

  findByEmail = async (email) => {
    try {
      const doctor = await DoctorModel.findOne({ email });
      return doctor;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  uploadDocument = async ({ doctorId, imageUrl, idPdfUrl, degreePdfUrl }) => {
    try {
      console.log("doctorId", doctorId);
      const objectId = new mongoose.Types.ObjectId(doctorId);
      const updatedDoctor = await DoctorModel.findOneAndUpdate(
        { _id: objectId }, 
        {
          $set: {
            profileImageUrl: imageUrl,
            idproofUrl: idPdfUrl,
            degreeDocumentUrl: degreePdfUrl,
          },
        },
        { new: true } // this option ensures the updated document is returned
      );
      
      console.log(updatedDoctor);
      return updatedDoctor;
    } catch (err) {
      console.log("reeeeeeepoooo", err);
      throw err;
    }
  };

  uploadDocument2 = async ({
    doctorId,
    gender,
    phone,
    city,
    state,
    clinicaddress,
    serviceType,
    specialization,
    experience,
  }) => {
    try {
      const objectId = new mongoose.Types.ObjectId(doctorId);
      const updatedDoctor = await DoctorModel.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            gender: gender,
            phone: phone,
            city: city,
            state: state,
            clinicaddress: clinicaddress,
            serviceType: serviceType,
            specialization: specialization,
            experience: experience,
            steps: 3,
          },
        },
        { new: true }
      );
      console.log(updatedDoctor);
      return updatedDoctor;
    } catch (err) {
      console.log("DR upload document2", err);
      throw err;
    }
  };

  uploadDocument3 = async ({ doctorId, consultationFee, availability }) => {
    try {
      const objectId = new mongoose.Types.ObjectId(doctorId);
      const updatedDoctor = await DoctorModel.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            consultationFee: consultationFee,
            availability: availability,
            steps: 4,
          },
        },
        { new: true }
      );
      console.log(updatedDoctor);

      return updatedDoctor;
    } catch (err) {
      console.log("DR upload document3", err);
      throw err;
    }
  };

  getAllDoctors = async () => {
    try {
      const doctors = await DoctorModel.find().populate("feedbacks").exec();
      return doctors;
    } catch (err) {
      console.log("DR get all doctors", err);
      throw err;
    }
  };

  getDoctorById = async (doctorId) => {
    const objectId = new mongoose.Types.ObjectId(doctorId);
    
    // console.log("objectid ",objectId);
    try {
      const doctor = await DoctorModel.findById(doctorId)
        .populate({
          path: "feedbacks",
          populate: {
            path: "patient", 
            select: "name",
          },
        })
        .exec();

      // console.log("doctor",doctor);
      return doctor;
    } catch (err) {
      console.log("DR get doctor by id", err);
      throw err;
    }
  };

  getFeedbackByDoctorId = async (doctorId) => {
    try {
      const doctor = await DoctorModel.findById(doctorId)
        .populate("feedbacks")
        .exec();
      return doctor;
    } catch (err) {
      console.log("DR get feedback by doctor id", err);
      throw err;
    }
  };

  getAppointmentsByDoctorId = async (doctorId) => {
    try {
      const doctor = await DoctorModel.findById(doctorId)
        .populate({
          path: "appointments", 
          populate: {
            path: "patient", 
            select: "name email", 
          },
        })
        .exec();

      console.log("doctor", doctor);

      doctor.appointments.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      return doctor.appointments;
    } catch (err) {
      console.log("DR get appointments by doctor id", err);
      throw err;
    }
  };

  getConfirmedAppointmentsByDoctorId = async (doctorId) => {
    try {
      const doctor = await DoctorModel.findById(doctorId)
        .populate({
          path: "appointments", 
          match: { status: "Confirmed" }, 
          populate: {
            path: "patient",
            select: "name email", 
          },
        })
        .exec();

      console.log("doctor", doctor);

      doctor.appointments.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      return doctor.appointments;
    } catch (err) {
      console.log("DR get appointments by doctor id", err);
      throw err;
    }
  };

  addavailability = async (doctorId, availability, fees) => {
    try {
      const objectId = new mongoose.Types.ObjectId(doctorId);
      const doctor = await DoctorModel.findById(objectId);

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      const existingDay = doctor.availability.find(
        (a) => a.day === availability.day
      ); //doctor will not add added slot again..

      if (existingDay) {
        existingDay.slots.push(...availability.slots);
      } else {
        doctor.availability.push(availability);
      }

      console.log("fees", fees);

      doctor.consultationFee = fees;

      console.log("Doctor", doctor);

      const updatedDoctor = await doctor.save();
      console.log(updatedDoctor);
      return updatedDoctor;
    } catch (err) {
      console.log("DR add availability", err);
      throw err;
    }
  };

   deleteDoctorAppointments = async (doctorId) => {
    try {
      // Step 1: Find all the appointments of the doctor
      const appointments = await AppointmentModel.find({ doctor: doctorId });
  
      if (!appointments || appointments.length === 0) {
        return 'No appointments found for this doctor.';
      }
  
      // Step 2: Extract the appointment IDs
      const appointmentIds = appointments.map((appointment) => appointment._id);
  
      // Step 3: Use bulk operations to update all patients at once
      const bulkOps = [
        ...await PatientModel.find({ appointments: { $in: appointmentIds } })
          .map(patient => ({
            updateOne: {
              filter: { _id: patient._id },
              update: { $pull: { appointments: { $in: appointmentIds } } }
            }
          }))
      ];
  
      // Perform all updates in bulk if necessary
      if (bulkOps.length > 0) {
        await PatientModel.bulkWrite(bulkOps);
      }
  
      // Step 4: Delete the appointments from the Appointment collection
      await AppointmentModel.deleteMany({ _id: { $in: appointmentIds } });
  
      // Step 5: Optionally, clear the doctor's appointments array
      await DoctorModel.updateOne(
        { _id: doctorId },
        { $pull: { appointments: { $in: appointmentIds } } }
      );
  
      return 'Appointments and references successfully deleted.';
    } catch (error) {
      console.error('Error deleting appointments:', error);
      return 'Error deleting appointments: ' + error.message;
    }
  };
  
  updateProfile = async (doctorId, data) => {
    try{
      const objectId = new mongoose.Types.ObjectId(doctorId);
      console.log('doctorId:', doctorId);
      console.log('data:', data);
      const updatedDoctor = await DoctorModel.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            clinicaddress: data.clinicaddress,
            city: data.city,
            state: data.state,
            serviceType: data.serviceType,
            consultationFee: data.consultationFee,
          },
        },
        { new: true }
      );
      console.log('updatedDoctor:', updatedDoctor);
      if(!updatedDoctor){
        return false;
      }
      return updatedDoctor;
    }catch (error) {
      console.error('Error updating appointments:', error);
      return 'Error updating appointments: ' + error.message;
    }
  }
  

  getWeeklyStats = async(doctorId)=>{
    try{
      const objectId = new mongoose.Types.ObjectId(doctorId);
      const appointemets = await AppointmentModel.find({doctor:objectId});
      console.log('appointemets:', appointemets);
      const weeklyStats = {
        totalAppointments: [],
      };

      const today = new Date();
      const istdate = moment(today).tz("Asia/Kolkata").format("YYYY-MM-DD");
      console.log('istdate:', istdate);

      const startOfWeek  = moment(istdate).startOf('week');

      // Iterate over the next 7 days (for this week)
    for (let i = 0; i < 7; i++) {
      const startOfDay = startOfWeek.clone().add(i, 'days').startOf('day'); // Start of the day
      const endOfDay = startOfDay.clone().endOf('day'); // End of the day

      // Format the date for the output
      const dayDate = startOfDay.format("YYYY-MM-DD");

      // Filter appointments that fall within the current day's range
      const dailyAppointments = appointemets.filter(appointment => {
        const appointmentDate = moment(appointment.date).tz('Asia/Kolkata');
        return appointmentDate.isBetween(startOfDay, endOfDay, null, '[]');
      });

      // Push the total appointments for that day
      weeklyStats.totalAppointments.push({
        date: dayDate,
        appointments: dailyAppointments.length,
      });
    }

    console.log('weeklyStats:', weeklyStats);
    return weeklyStats;
    
    }catch (error) {
      console.error('Error deleting appointments:', error);
      return error.message;
    }
  }

}
