import DoctorModel from "../doctor/doctor.model.js";
import PatientModel from "../patient/patient.model.js";
import AdminModel from "./admin.model.js";
export default class AdminRepository {

  async verifyDoctor(doctorId) {
    try {
      const doctor = await DoctorModel.findByIdAndUpdate(
        doctorId,
        { verificationStatus: "Verified" },
        {
          new: true,
        }
      );
      return doctor;
    } catch (error) {
      throw new Error(error);
    }
  }

    async deleteDoctor(doctorId) {
        try {
        const doctor = await DoctorModel.findByIdAndDelete(doctorId);
        return doctor;
        } catch (error) {
        throw new Error(error);
        }
    }

    async deletePatient(patientId) {
        try {
            const patient = await PatientModel.findByIdAndDelete(patientId);
            return patient;
        } catch (error) {
            throw new Error(error);
        }
    }


    findByEmail = async (email) => {
        try {
          const admin = await AdminModel.findOne({ email });
          return admin;
        } catch (err) {
          // console.log(err);
          throw err;
        }
      };

}
