import express from 'express';
import AppointmentController from './appointments.controller.js';
import app from '../../../app.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const appointmentRouter = express.Router();
const appointmentController = new AppointmentController();


// appointmentRouter.post('/bookappointment', (req,res,next)=>{
//     appointmentController.bookAppointment(req,res,next);
// });



appointmentRouter.get('/availableslots/:doctorId', (req,res,next)=>{
    console.log("inside availableslots route");
    appointmentController.getAvailableSlots(req,res,next);
});

appointmentRouter.post('/bookappointment', jwtAuth ,(req,res,next)=>{
    // console.log("inside bookappointment route");
    appointmentController.bookAppointment(req,res,next);
});

appointmentRouter.get('/getappointment/:aid', (req,res,next)=>{
    console.log("getappointmentbyaid", req.params.aid);
    appointmentController.getAppointmentByAId(req,res,next);
});


export default appointmentRouter;