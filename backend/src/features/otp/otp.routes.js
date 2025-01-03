
import express from "express";
import mongoose from "mongoose";
import OtpController from "./otp.controller.js";

const OtpRouter = express.Router();

const otpController = new OtpController();

OtpRouter.post('/send',(req,res,next)=>{
    otpController.sendOtp(req,res,next);
})
OtpRouter.post('/verify',(req,res,next)=>{
    otpController.verifyOtp(req,res,next);
})
// OtpRouter.post('/reset-password',(req,res,next)=>{
//     otpController.resetPassword(req,res,next);
// })
export default OtpRouter;

