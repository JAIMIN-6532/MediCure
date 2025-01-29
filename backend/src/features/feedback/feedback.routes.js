import express from 'express';
import FeedbackController from './feedback.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const feedbackRouter = express.Router();
const feedbackController = new FeedbackController();

feedbackRouter.post('/addfeedback' ,(req,res,next)=>{ //jwtAuth, add
    feedbackController.addFeedback(req,res,next);
});

feedbackRouter.get('/getfeedback/:id', (req,res,next)=>{
    feedbackController.getFeedbackById(req,res,next);
});

feedbackRouter.get('/getavgrating/:did',(req,res,next)=>{
    feedbackController.getAvgRatingByDoctorId(req,res,next);
})

feedbackRouter.get('/getalldoctorsavgrating',(req,res,next)=>{
    feedbackController.getAllDoctorsAvgRating(req,res,next);
})


export default feedbackRouter;