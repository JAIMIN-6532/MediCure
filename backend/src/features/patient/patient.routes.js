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
patientRouter.post('/logout',(req,res,next)=>{
    patientController.userLogout(req,res,next)
});

patientRouter.get('/getpatient/:id',(req,res,next)=>{
    console.log("inside get patient by id route",req.params.id);
    patientController.getPatientById(req,res,next)
});

patientRouter.get("/get-details",jwtAuth,(req,res,next)=>{
    console.log(req.userID)
    patientController.getUserById(req,res,next)
});

patientRouter.get("/getfeedback/:id", (req,res,next)=>{
    patientController.getFeedbackByPatientId(req,res,next);
});

patientRouter.get("/getappointment/:pid", (req,res,next)=>{
    patientController.getAppointmentsByPatientId(req,res,next);
});


export default patientRouter;