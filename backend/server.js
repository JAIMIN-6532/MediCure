import server from "./app.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./src/config/db.js";
import AppointmentController from "./src/features/appointments/appointments.controller.js";


const appointmentController = new AppointmentController();

const httpServer = createServer(server);

const io = new Server(httpServer, {
  cors: {
    origin: "http://mymedicurebucket.s3-website.ap-south-1.amazonaws.com/", //https://medicure-frontend-qii7.onrender.com
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  // console.log("A user connected");

  // Listen for booking events
  socket.on("bookAppointment", async (appointmentData) => {
    try {
      const appointment = await appointmentController.bookAppointment(
        appointmentData
      );
      // console.log("appointment", appointment);
      // emiting booking confirmation to all connected clients
      io.emit("appointmentBooked", appointment);
    } catch (error) {
      // console.error("Error booking appointment:", error);
      socket.emit("error", "Error booking appointment");
    }
  });

  // Listen for lockSlot events
  socket.on("lockSlot", async (slotData) => {
    try {
      // console.log("Slot data:", slotData);
      const lockedSlot = await appointmentController.lockAppointment(slotData);

      // emitting notification for the locked slot to all clients

      io.emit("slotLocked", lockedSlot);
      setTimeout(async () => {
        const unlockedSlot = await appointmentController.unlockAppointment(
          slotData
        );
        // console.log("Unlocked Slot before emit:", unlockedSlot);
        io.emit("slotUnlocked", unlockedSlot);
      }, 15 * 60 * 1000); // unlock slot after 15 minutes
    } catch (error) {
      // console.error("Error locking slot:", error);
      socket.emit("error", "Error locking slot");
    }
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});

const serverStart = httpServer.listen(process.env.PORT, async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:${process.env.PORT}`);
  }
});
