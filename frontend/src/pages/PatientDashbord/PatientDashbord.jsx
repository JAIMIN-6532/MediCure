import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import Navigation from "../../components/PatientDashbord/Pdnavbar/Navigation";
import Profile from "../../components/PatientDashbord/Pdnavbar/Profile";
import Appointments from "../../components/PatientDashbord/PdTabs/Appointments";
import {
  fetchPatientById,
  fetchAppointmentsByPatientId,
} from "../../reduxToolkit/reducers/PatientReducer.js";

const PatientDashbord = () => {
  const [activeNav, setActiveNav] = useState("My-Appointments");
  const { patientId } = useParams();
  const dispatch = useDispatch();

  const { patientappointments, selectedPatient, fetchPatientByIdStatus } =
    useSelector((state) => state.patients);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientById(patientId));
      dispatch(fetchAppointmentsByPatientId(patientId));
    }
  }, [dispatch, patientId]);

  useEffect(() => {
    gsap.fromTo(
      ".sidebar",
      { x: -300 },
      { x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // GSAP animation for Main Content Fade-In
    gsap.fromTo(
      ".main-content",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.inOut" }
    );
  }, [activeNav]);

  const renderContent = () => {
    switch (activeNav) {
      case "My-Appointments":
        return (
          <Appointments
            patientappointments={patientappointments}
            patient={selectedPatient}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-gray-500">Coming Soon...</h2>
          </div>
        );
    }
  };

  return (
    <div>
      {fetchPatientByIdStatus === "idel" ||
      fetchPatientByIdStatus === "loading" ? (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader className="animate-spin" size={50} color="blue" />
        </div>
      ) : (
        <div className="flex min-h-screen bg-gray-50 pt-[80px] p-4">
          {/* Sidebar */}
          <div className="sidebar w-80 bg-white p-6 shadow-lg">
            <Profile patient={selectedPatient} />
            <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />
          </div>

          {/* Main Content */}
          <div className="main-content flex-1 p-8">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashbord;
