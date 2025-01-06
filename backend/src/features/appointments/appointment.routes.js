import express from 'express';
import AppointmentController from './appointments.controller.js';
import app from '../../../app.js';

const appointmentRouter = express.Router();
const appointmentController = new AppointmentController();


// appointmentRouter.post('/bookappointment', (req,res,next)=>{
//     appointmentController.bookAppointment(req,res,next);
// });

appointmentRouter.get('/availableslots/:doctorId', (req,res,next)=>{
    appointmentController.getAvailableSlots(req,res,next);
});

appointmentRouter.post('/bookappointment', (req,res,next)=>{
    appointmentController.bookAppointment(req,res,next);
});



export default appointmentRouter;