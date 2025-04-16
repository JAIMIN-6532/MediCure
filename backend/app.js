import express from "express";
import dotenv from "dotenv";
import path from "path";
import url from "url"; // import url module
dotenv.config();
import cookieParser from 'cookie-parser';


import OtpRouter from "./src/features/otp/otp.routes.js";
import patientRouter from "./src/features/patient/patient.routes.js";
import doctorRouter from "./src/features/doctor/doctor.routes.js";
import appointmentRouter from "./src/features/appointments/appointment.routes.js";
import feedbackRouter from "./src/features/feedback/feedback.routes.js";
import errorHandler from "./src/errorhandler/errorHandler.js";
import paymentRouter from "./src/features/payment/payment.routes.js";
import { adminRouter } from "./src/features/admin/admin.routes.js";

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
app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Origin',
      '*',     
    );
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    // return ok for preflight request.
    if (req.method == 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });


  
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('uploads'));

app.use("/api/patient",patientRouter);

app.use("/api/doctor" , doctorRouter)

app.use("/api/otp",OtpRouter);

app.use("/api/appointment",appointmentRouter);

app.use("/api/feedback",feedbackRouter);

app.use("/api/payment",paymentRouter);

app.use("/api/admin",adminRouter);

app.use(errorHandler);


app.use((req, res) => {
    res
      .status(404)
      .send(
        'API not found.'
      );
  });


export default app;