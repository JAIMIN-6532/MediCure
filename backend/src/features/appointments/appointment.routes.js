import express from "express";

import AppointmentController from "./appointments.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const appointmentRouter = express.Router();
const appointmentController = new AppointmentController();

appointmentRouter.get(
  "/availableslots/:doctorId",
  jwtAuth,
  (req, res, next) => {
    appointmentController.getAvailableSlots(req, res, next);
  }
);

appointmentRouter.post("/bookappointment", jwtAuth, (req, res, next) => {
  appointmentController.bookAppointment(req, res, next);
});

appointmentRouter.post("/cancel/:aid", (req, res, next) => {
  appointmentController.cancelAppointment(req, res, next);
});

//only used for backend not connected below func in frontend.
appointmentRouter.get("/getappointment/:aid", (req, res, next) => {
  appointmentController.getAppointmentByAId(req, res, next);
});

appointmentRouter.post("/sendmail/:aid", (req, res, next) => {
  appointmentController.sendVideoCallLinkMail(req, res, next);
});

appointmentRouter.post(
  "/bookappointment/lock",
  jwtAuth,
  async (req, res, next) => {
    try {
      const lockedSlot = await appointmentController.lockAppointment(req.body);
      return res.status(200).json({
        message: "Appointment locked successfully",
        lockedSlot,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default appointmentRouter;
