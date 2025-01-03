import express from 'express'
import DoctorController from './doctor.controller.js';
import { uploadFiles } from '../../middleware/uploadfile.middleware.js';
const doctorRouter = express.Router();
const doctorController = new DoctorController();

doctorRouter.post('/dsignup',(req,res,next)=>{
    doctorController.signUp(req,res,next);
})

doctorRouter.post('/:doctorId/uploaddoc1', uploadFiles  ,(req, res, next) => {
    doctorController.uploadDocument(req, res, next);
  });


export default doctorRouter;
