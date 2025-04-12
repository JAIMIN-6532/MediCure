import DoctorRepository from "../doctor/doctor.repository.js";
import PatientRepository from "../patient/patient.repository.js";
import AdminRepository from "./admin.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class AdminController {
  constructor() {
    this.doctorRepository = new DoctorRepository();
    this.patientRepository = new PatientRepository();
    this.adminRepository = new AdminRepository();
  }

  async getAllDoctors(req, res, next) {
    try {
      const doctors = await this.doctorRepository.getAllDoctorsForAdmin();
      return res.status(200).json(doctors);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllPatients(req, res, next) {
    try {
      const patients = await this.patientRepository.getAllPatientsForAdmin();
      return res.status(200).json(patients);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyDoctor(req, res, next) {
    try {
      const doctorId = req.params.doctorId;
      const doctor = await this.adminRepository.verifyDoctor(doctorId);
      return res
        .status(200)
        .json({ doctor, message: "Doctor verified successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteDoctor(req, res, next) {
    try {
      const doctorId = req.params.doctorId;
      const doctor = await this.adminRepository.deleteDoctor(doctorId);
      return res
        .status(200)
        .json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deletePatient(req, res, next) {
    try {
      const patientId = req.params.patientId;
      const patient = await this.adminRepository.deletePatient(patientId);
      return res
        .status(200)
        .json({ success: true, message: "Patient deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      let user = await this.adminRepository.findByEmail(email);

      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        const result = await bcrypt.compare(
          password.trim(),
          user.password.trim()
        );
        if (result) {
          // create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
              userType: "admin",
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "5h",
            }
          );
          // send token.
          return res.status(200).send({ user: user, token });
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      // console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }
}
