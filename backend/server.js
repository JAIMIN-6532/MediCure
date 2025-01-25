import server from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import AppointmentRepository from "./src/features/appointments/appointment.repository.js";
import AppointmentController from "./src/features/appointments/appointments.controller.js";
import cors from "cors";
dotenv.config();

// const appointmentRepository = new AppointmentRepository();
const appointmentController = new AppointmentController();

const httpServer = createServer(server);


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
  },
});

// Socket.IO events

// Example event for booking an appointment
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for booking events
  socket.on('bookAppointment', async (appointmentData) => {
    try {
      // Here you handle the booking logic
      console.log("here")
      const appointment = await appointmentController.bookAppointment(appointmentData);
      console.log("appointment", appointment);
      // Emit the booking confirmation to all connected clients
      io.emit('appointmentBooked', appointment);
    } catch (error) {
      console.error("Error booking appointment:", error);
      socket.emit('error', 'Error booking appointment');
    }
  });

  // Listen for lockSlot events
  socket.on('lockSlot', async (slotData) => {
    try {
      // Handle locking logic
      console.log("Slot data:", slotData);
      const lockedSlot = await appointmentController.lockAppointment(slotData);

      // Emit a notification for the locked slot to all clients

      io.emit('slotLocked', lockedSlot);
       setTimeout(async() => {
        const unlockedSlot = await appointmentController.unlockAppointment(slotData);
        io.emit('slotUnlocked', unlockedSlot);
      }, 15*60*1000); // Unlock slot after 2 minutes
    } catch (error) {
      console.error("Error locking slot:", error);
      socket.emit('error', 'Error locking slot');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


console.log(process.env.PORT);
const serverStart = httpServer.listen(process.env.PORT, async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:${process.env.PORT}`);
  }
});
