// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import DoctorsList from "./pages/Doctors/DoctorsList";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
import PatientSignUp from "./pages/Patient/PatientSignUp";
import DoctorSignUp from "./pages/Doctors/DoctorsSignUp";
import DsignIn from "./components/DsignIn";
import DsignUp from "./components/DoctorsForm/DsignUp";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dsignin" element={<DsignIn />} />
          <Route path="/signup" element={<PatientSignUp />} />
          <Route path="dsignup"element={<DsignUp />}/>
          <Route path="/doctor-signup" element={<DoctorSignUp />} />

          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
