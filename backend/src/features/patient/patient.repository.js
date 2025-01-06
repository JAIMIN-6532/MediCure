import patientModel from "./patient.model.js";
import { ApplicationError } from "../../errorhandler/applicationError.js";
export default class PatientRepository {
  signUp = async (name, email, password) => {
    try {
      const newPatient = await patientModel.create({
        name,
        email,
        password,
      });
      console.log(newPatient);
      return newPatient;
    } catch (error) {
      console.error(error);
    }
  };
  async signIn(email, password) {
    try {
      return await patientModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      return await patientModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByUserId(userId) {
    try {
      return await patientModel.findById(userId);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
