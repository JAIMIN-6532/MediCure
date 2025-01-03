import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import userRouter from "./src/features/users/user.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import cookieParser from 'cookie-parser';
// import serviceRouter from "./src/features/service/service.routes.js";
import OtpRouter from "./src/features/otp/otp.routes.js";
import patientRouter from "./src/features/patient/patient.routes.js";
import doctorRouter from "./src/features/doctor/doctor.routes.js";

// import { ApplicationError } from "./src/error-handler/Applicationerror.js";

dotenv.config();

const app = express();

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
      'http://localhost:5500'
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

app.use("/api/patient",patientRouter);
app.use("/api/doctor" , doctorRouter)
app.use("/api/otp",OtpRouter);
// app.use("/api/service/",serviceRouter);


app.use((req, res) => {
    res
      .status(404)
      .send(
        'API not found.'
      );
  });

  

export default app;