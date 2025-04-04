import express from "express";

import PatientController from "./patient.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const patientRouter = express.Router();

const patientController = new PatientController();

patientRouter.post('/signup',(req,res,next)=>{
    patientController.signUp(req,res,next)
});
patientRouter.post('/signin',(req,res,next)=>{
    patientController.signIn(req,res,next)
});

//not used since we are not using session based auth.
patientRouter.post('/logout',(req,res,next)=>{
    patientController.userLogout(req,res,next)
});

patientRouter.get('/:id',(req,res,next)=>{
    patientController.getPatientById(req,res,next)
});

// only used for backend not connected below func in frontend.
patientRouter.get("/get-details",jwtAuth,(req,res,next)=>{
    patientController.getUserById(req,res,next)
});

// only used for backend not connected below func in frontend.
patientRouter.get("/getfeedback/:id", (req,res,next)=>{
    patientController.getFeedbackByPatientId(req,res,next);
});

patientRouter.get("/getappointment/:pid", (req,res,next)=>{
    patientController.getAppointmentsByPatientId(req,res,next);
});


export default patientRouter;