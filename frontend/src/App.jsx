import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import DoctorsList from "./pages/Doctors/DoctorsList";
import Footer from "./components/Footer";
import SignIn from "./components/Auth/SignIn";
import PatientSignUp from "./pages/Patient/PatientSignUp";
import DoctorSignUp from "./pages/Doctors/DoctorsSignUp";
import DsignIn from "./components/Auth/DsignIn";
import DsignUp from "./components/DoctorsForm/DsignUp";
import PrivateRoute from "./components/PrivateRoute";
import DoctorDashbord from "./pages/DoctorDashbord/DoctorDashbord";
import DoctorProfilePage from "./pages/Patient/DoctorProfilePage";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import PatientDashbord from "./pages/PatientDashbord/PatientDashbord";
import PrivateRoutePatient from "./components/PrivateRoutePatient";
import Room from "./zegocloud/Room";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashbord from "./pages/Admin/AdminDashboard";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import AdminLogin from "./pages/Admin/AdminLogin";


const App = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dsignin" element={<DsignIn />} />
            <Route path="/signup" element={<PatientSignUp />} />
            <Route path="dsignup" element={<DsignUp />} />
            <Route path="/doctor-signup" element={<DoctorSignUp />} />
            <Route
              path="/d-dashbord/:doctorId"
              element={<PrivateRoute element={<DoctorDashbord />} />}
            />
            <Route
              path="/p-dashbord/:patientId"
              element={<PrivateRoutePatient element={<PatientDashbord />} />}
            />
            <Route
              path="/doctorprofilepatientview/:doctorId"
              element={<DoctorProfilePage />}
            />
            <Route
              path="/bookappointment/:doctorId"
              element={<BookAppointment />}
            />

            <Route path="/room/:appointmentId" element={<Room />} />
            <Route path="/admin" element={<PrivateRouteAdmin element={<AdminDashbord />} />} />
            <Route path="admin/login" element={<AdminLogin />}/>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;
