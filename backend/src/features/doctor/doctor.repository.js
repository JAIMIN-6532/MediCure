import mongoose from "mongoose";
import DoctorModel from "./doctor.model.js";

export default class DoctorRepository {
  signUp = async ({ name, email, password }) => {
    try {
      // const {name,email,password} = req.body;
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
        { _id: objectId }, // Condition to find the doctor by doctorId
        {
          $set: {
            profileImageUrl: imageUrl,
            idproofUrl: idPdfUrl,
            degreeDocumentUrl: degreePdfUrl,
          },
        },
        { new: true } // This option ensures the updated document is returned
      );
      //   const updatedDoctor = await DoctorModel.findByIdAndUpdate(
      //     {_id : doctorId}, // doctorId is passed in the function
      //     {
      //         $set: {
      //             profileImageUrl: imageUrl,
      //             idproofUrl: idPdfUrl,
      //             degreeDocumentUrl: degreePdfUrl,
      //         },
      //     },
      //     { new: true } // This option returns the updated document
      // );
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
    clinicaddress,
    pincode,
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
            clinicaddress: clinicaddress,
            pincode: pincode,
            specialization: specialization,
            experience: experience,
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

    uploadDocument3 = async ({ doctorId, consultationFee ,availability, serviceType }) => {
        try {
        const objectId = new mongoose.Types.ObjectId(doctorId);
        const updatedDoctor = await DoctorModel.findOneAndUpdate(
            { _id: objectId },
            {
            $set: {
                consultationFee: consultationFee,
                availability: availability,
                serviceType: serviceType,
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
    }

    getDoctorById = async (doctorId) => { 
      const objectId = new mongoose.Types.ObjectId(doctorId);
      // console.log("objectid ",objectId);
        try {
        const doctor = await DoctorModel.findById(objectId);
        // console.log("doctor",doctor);
        return doctor;
        } catch (err) {
        console.log("DR get doctor by id", err);
        throw err;
        }
    }

    getFeedbackByDoctorId = async (doctorId) => {
        try {
        const doctor = await DoctorModel.findById(doctorId).populate("feedbacks").exec();
        return doctor;
        } catch (err) {
        console.log("DR get feedback by doctor id", err);
        throw err;
        }
    }

    getAppointmentsByDoctorId = async (doctorId) => {
        try {
        const doctor = await DoctorModel.findById(doctorId).populate("appointments").exec();
        console.log("doctor",doctor);
        return doctor;
        } catch (err) {
        console.log("DR get appointments by doctor id", err);
        throw err;
        }
    }

    addavailability = async ( doctorId, availability ,fees) => {
      try {
          const objectId = new mongoose.Types.ObjectId(doctorId);
          const doctor = await DoctorModel.findById(objectId);
  
          if (!doctor) {
              throw new Error('Doctor not found');
          }
  
          const existingDay = doctor.availability.find(a => a.day === availability.day);   //doctor will not add added slot again..
  
          if (existingDay) {
              existingDay.slots.push(...availability.slots);
          } else {
              doctor.availability.push(availability);
          }

          console.log("fees",fees);

          doctor.consultationFee = fees;

          console.log("Doctor",doctor);
  
          const updatedDoctor = await doctor.save();
          console.log(updatedDoctor);
          return updatedDoctor;
      } catch (err) {
          console.log("DR add availability", err);
          throw err;
      }
  }
}
