import express from "express";
import DoctorController from "./doctor.controller.js";
import upload from "../../middleware/uploadfile.middleware.js";
import jwtAuth from "../../middleware/jwt.middleware.js";
import DoctorRepository from "./doctor.repository.js";
import zegoCloud from "../../utils/zegoCloud.js";

const doctorRepository = new DoctorRepository();
const doctorRouter = express.Router();
const doctorController = new DoctorController();

doctorRouter.post("/dsignup", (req, res, next) => {
  doctorController.signUp(req, res, next);
});

doctorRouter.post("/dsignin", (req, res, next) => {
  doctorController.signIn(req, res, next);
});

doctorRouter.post(
  "/:doctorId/uploaddoc1",
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "id", maxCount: 1 },
    { name: "degree", maxCount: 1 },
  ]),
  (req, res, next) => {
    doctorController.uploadDocument(req, res, next);
  }
);

doctorRouter.post("/:doctorId/uploaddoc2", (req, res, next) => {
  doctorController.uploadDocument2(req, res, next);
});

doctorRouter.post("/:doctorId/uploaddoc3", (req, res, next) => {
  doctorController.uploadDocument3(req, res, next);
});

doctorRouter.get("/", (req, res, next) => {
  doctorController.getAllDoctors(req, res, next);
});

doctorRouter.get("/:doctorId", (req, res, next) => {
  doctorController.getDoctorById(req, res, next);
});

doctorRouter.get("/getfeedback/:doctorId", (req, res, next) => {
  doctorController.getFeedbackByDoctorId(req, res, next);
});

doctorRouter.get("/getappointment/:did", jwtAuth, (req, res, next) => {
  doctorController.getConfirmedAppointmentsByDoctorId(req, res, next);
});

doctorRouter.post("/addavailability/:did", (req, res, next) => {
  doctorController.addavailability(req, res, next);
});
//only for backend not connectd below deleteroute in frontend . this is only for bulk delete appointemnts
doctorRouter.post("/deletedidappointment/:did", (req, res, next) => {
  doctorRepository.deleteDoctorAppointments(req.params.did, res, next);
});

doctorRouter.post("/generateToken", (req, res, next) => {
  zegoCloud(req, res, next);
});

doctorRouter.post("/updateprofile/:did", (req, res, next) => {
  doctorController.updateProfile(req, res, next);
});

// this route is not been used in frontend ..
doctorRouter.get("/weekly-stats/:did", (req, res, next) => {
  doctorController.getWeeklyStats(req, res, next);
});

doctorRouter.get("/weekly-appointments/:did", (req, res, next) => {
  doctorController.getWeeklyAppointments(req, res, next);
});
doctorRouter.get("/monthly-revenue/:did", (req, res, next) => {
  doctorController.getMonthlyRevenue(req, res, next);
});
doctorRouter.get("/appointment-types/:did", (req, res, next) => {
  doctorController.getAppointmentTypes(req, res, next);
});

export default doctorRouter;
