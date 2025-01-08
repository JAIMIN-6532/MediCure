import express from 'express';
import FeedbackController from './feedback.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const feedbackRouter = express.Router();
const feedbackController = new FeedbackController();

feedbackRouter.post('/addfeedback',jwtAuth ,(req,res,next)=>{
    feedbackController.addFeedback(req,res,next);
});

feedbackRouter.get('/getfeedback/:id', (req,res,next)=>{
    feedbackController.getFeedbackById(req,res,next);
});



export default feedbackRouter;