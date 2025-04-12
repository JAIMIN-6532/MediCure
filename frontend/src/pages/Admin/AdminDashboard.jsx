import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";

import Doctors from "./Doctors";
import Patients from "./Patients";
import Navigation from "./Navigation";
import {
  fetchAllDoctors,
  fetchAllPatients,
  deleteDoctor,
  verifyDoctor,
    deletePatient,
} from "../../reduxToolkit/reducers/AdminReducer";

const AdminDashbord = () => {
  const [activeNav, setActiveNav] = useState("Doctors");
  const dispatch = useDispatch();
  const { doctors, doctorsStatus, error } = useSelector((state) => state.admin);
  const { patients, patientsStatus } = useSelector((state) => state.admin);

  useEffect(() => {
    if (doctorsStatus === "idle") {
      dispatch(fetchAllDoctors());
    }
  }, [dispatch, doctorsStatus]);

  useEffect(() => {
    if (patientsStatus === "idle") {
      dispatch(fetchAllPatients());
    }
  }, [dispatch, patientsStatus]);

  // sort doctors by createdAt (most recent first)
  const sortedDoctors = doctors
    ? [...doctors].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const handleVerifyDoctor = (doctorId) => {
    dispatch(verifyDoctor(doctorId));
  };

  const handleDeleteDoctor = (doctorId) => {
    dispatch(deleteDoctor(doctorId));
  };

    const handleDeletePatient = (patientId) => {
        dispatch(deletePatient(patientId));
    }

  const renderContent = () => {
    switch (activeNav) {
      case "Doctors":
        return (
          <Doctors
            doctors={sortedDoctors}
            status={doctorsStatus}
            error={error}
            onVerifyDoctor={handleVerifyDoctor}
            onDeleteDoctor={handleDeleteDoctor}
          />
        );
      case "Patients":
        return (
          <Patients patients={patients} status={patientsStatus} error={error} onDeletePatient={handleDeletePatient} />
        );
    }
  };

  useEffect(() => {
    gsap.fromTo(
      ".sidebar",
      { x: -300 },
      { x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".main-content",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.inOut" }
    );
  }, [activeNav]);

  return (
    <div>
      <div className="flex min-h-screen bg-gray-50 pt-[80px] p-4">
        {/* Sidebar */}
        <div className="sidebar w-80 bg-white p-6 shadow-lg">
          <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />
        </div>

        {/* Main Content */}
        <div className="main-content flex-1 p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashbord;
