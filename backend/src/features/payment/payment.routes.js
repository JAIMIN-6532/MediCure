import express from 'express';
import PaymentController from './payment.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const paymentRouter = express.Router();
const paymentController = new PaymentController();
paymentRouter.post('/create-order',jwtAuth,(req,res,next)=>{
    paymentController.createOrder(req,res,next);
});
paymentRouter.post("/webhook", (req, res, next) => {
    paymentController.validateWebhook(req, res, next);
  });

paymentRouter.post("/verify", (req, res, next) => {

    paymentController.verifyPayment(req, res, next);
});



export default paymentRouter;