import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import userRouter from "./src/features/users/user.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import cookieParser from "cookie-parser";
// import serviceRouter from "./src/features/service/service.routes.js";
import OtpRouter from "./src/features/otp/otp.routes.js";
import patientRouter from "./src/features/patient/patient.routes.js";
import doctorRouter from "./src/features/doctor/doctor.routes.js";
import appointmentRouter from "./src/features/appointments/appointment.routes.js";
import feedbackRouter from "./src/features/feedback/feedback.routes.js";
import errorHandler from "./src/errorhandler/errorHandler.js";
import paymentRouter from "./src/features/payment/payment.routes.js";
// import { ApplicationError } from "./src/error-handler/Applicationerror.js";
import path from "path";
import url from "url"; // import url module
dotenv.config();
const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cookieParser());

// app.use(
//   session({
//     secret: 'SecretKey',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// CORS policy configuration
const allowedOrigins = [
  "https://medicure-frontend-qii7.onrender.com",
  "https://medicure-go5v.onrender.com/api/doctor/generateToken", // Add more URLs here as needed
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // pre-flight response
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/otp", OtpRouter);

app.use("/api/appointment", appointmentRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/payment", paymentRouter);

// app.use("/api/service/",serviceRouter);
// app.use(express.static(path.join(__dirname, "build")));
// Send React's index.html for all other routes (client-side routing)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send("API not found.");
});

// app.use("/",(req,res)=>{
//   res.send("Welcome to the home page");
// })

export default app;
