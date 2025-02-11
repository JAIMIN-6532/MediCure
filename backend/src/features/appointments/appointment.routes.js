import express from "express";
import AppointmentController from "./appointments.controller.js";
import app from "../../../app.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const appointmentRouter = express.Router();
const appointmentController = new AppointmentController();

// appointmentRouter.post('/bookappointment', (req,res,next)=>{
//     appointmentController.bookAppointment(req,res,next);
// });

appointmentRouter.get("/availableslots/:doctorId", jwtAuth ,(req, res, next) => {
  console.log("inside availableslots route");
  appointmentController.getAvailableSlots(req, res, next);
});

appointmentRouter.post("/bookappointment", jwtAuth, (req, res, next) => {
  // console.log("inside bookappointment route");
  console.log("req.body", req.body);
  appointmentController.bookAppointment(req, res, next);
});

appointmentRouter.post("/cancel/:aid", (req, res, next) => {
  console.log("inside cancel route");
  appointmentController.cancelAppointment(req, res, next);
});

appointmentRouter.get("/getappointment/:aid", (req, res, next) => {
  console.log("getappointmentbyaid", req.params.aid);
  appointmentController.getAppointmentByAId(req, res, next);
});

appointmentRouter.post("/sendmail/:aid", (req, res, next) => {
  console.log("inside sendmail route");
  appointmentController.sendVideoCallLinkMail(req, res, next);
});

appointmentRouter.post(
  "/bookappointment/lock",
  jwtAuth,
  async (req, res, next) => {
    try {
      console.log("Inside lock route");
      // Call the controller method with req.body
      const lockedSlot = await appointmentController.lockAppointment(req.body);
      return res.status(200).json({
        message: "Appointment locked successfully",
        lockedSlot,
      });
    } catch (error) {
      next(error); // Pass to error handler
    }
  }
);

export default appointmentRouter;
