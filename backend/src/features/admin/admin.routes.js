import express from "express";


import AdminController from "./admin.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

export const adminRouter = express.Router();

const adminController = new AdminController();

adminRouter.get("/getallpatients", jwtAuth ,(req, res, next) => {
  adminController.getAllPatients(req, res, next);
});

adminRouter.get("/getalldoctors", jwtAuth ,(req, res, next) => {
  adminController.getAllDoctors(req, res, next);
});

adminRouter.delete("/doctor/:doctorId",jwtAuth, (req, res, next) => {
  adminController.deleteDoctor(req, res, next);
});

adminRouter.put("/doctor/verify/:doctorId" , (req, res, next) => {
  adminController.verifyDoctor(req, res, next);
});

adminRouter.delete("/patient/:patientId",jwtAuth, (req, res, next) => {
  adminController.deletePatient(req, res, next);
});

adminRouter.post("/signin", (req, res, next) => {
  adminController.signIn(req, res, next);
});

