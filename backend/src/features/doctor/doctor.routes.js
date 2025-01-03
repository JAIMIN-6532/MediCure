import express from 'express'
import DoctorController from './doctor.controller.js';

const doctorRouter = express.Router();
const doctorController = new DoctorController();

doctorRouter.post('/signup',(req,res,next)=>{
    doctorController.signUp(req,res,next);
})



export default doctorRouter;
