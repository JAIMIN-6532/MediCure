import express from "express";
import DoctorController from "./doctor.controller.js";
// import { uploadFiles } from '../../middleware/uploadfile.middleware.js';
import upload from "../../middleware/uploadfile.middleware.js";
import jwtAuth from "../../middleware/jwt.middleware.js";
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

doctorRouter.get("/getAllDoctors", (req, res, next) => {
  console.log("getalldoctors");
  doctorController.getAllDoctors(req, res, next);
});

doctorRouter.get("/doctorinfo/:doctorId", jwtAuth ,(req, res, next) => {
  // console.log("doctoridinparams", req.params.doctorId);
  doctorController.getDoctorById(req, res, next);
});

doctorRouter.get("/getfeedback/:doctorId", (req, res, next) => {
  doctorController.getFeedbackByDoctorId(req, res, next);
});

doctorRouter.get("/getappointment/:did",jwtAuth ,(req, res, next) => {
  console.log("getappointmentbydoctorid", req.params.did);
  doctorController.getAppointmentsByDoctorId(req, res, next);
}); 

doctorRouter.post("/addavailability/:did", (req, res, next) => {
  doctorController.addavailability(req, res, next);
});

export default doctorRouter;
