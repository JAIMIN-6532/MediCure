import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { fetchAppointmentsByDoctorId } from "../../reduxToolkit/reducers/DoctorReducer";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../components/DoctorDashbord/DDNavbar/Profile";
import Navigation from "../../components/DoctorDashbord/DDNavbar/Navigation";
import Stats from "../../components/DoctorDashbord/DDashbord/Stats";
import AppointmentList from "../../components/DoctorDashbord/DDashbord/AppointmentList";
import Appointments from "../../components/DoctorDashbord/DDTabs/Appointments";
import Patients from "../../components/DoctorDashbord/DDTabs/Patients";
import AvailableTimings from "../../components/DoctorDashbord/DDTabs/AvailableTimings";
import { fetchDoctorById } from "../../reduxToolkit/reducers/DoctorReducer";
import { useParams } from "react-router-dom";
import Settings from "../../components/DoctorDashbord/DDTabs/Settings";
import IndividualStatChart from "../../components/DoctorDashbord/DDashbord/StatsIndividualCharts";

const DoctorDashbord = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const dispatch = useDispatch();

  const { doctorId } = useParams();

  const { appointments, fetchAppointmentsStatus } = useSelector(
    (state) => state.doctors
  );
  const doctor = useSelector((state) => state.doctors.selectedDoctor);

  useEffect(() => {
    dispatch(fetchAppointmentsByDoctorId(doctorId));
    dispatch(fetchDoctorById(doctorId));
  }, [dispatch, doctorId]);

  console.log("Appointments: ", appointments);
  console.log("Doctor: ", doctor);
  const convertTo24HourFormat = (timeSlot) => {
    const [time, period] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 100 + minutes;
  };

  const today = new Date();
  const istDate = new Date(today.getTime() + (5 * 60 + 30) * 60 * 1000); // convert to IST for that adding 5:30

  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istDate.getUTCDate()).padStart(2, "0");

  const todayIST = `${year}-${month}-${day}`;

  const filteredAppointments = appointments?.filter((appointment) => {
    const appointmentDate = appointment.date.split("T")[0];
    return appointmentDate === todayIST;
  });

  const dispatchCancelAppointement = () => {
    dispatch(fetchAppointmentsByDoctorId(doctorId));
  };

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return (
          <>
            <div className="p-6">
              <Stats
                filteredAppointments={filteredAppointments}
                doctor={doctor}
                appointments={appointments}
              />

              <IndividualStatChart doctorId={doctor._id} />
            </div>
            <AppointmentList
              filteredAppointments={filteredAppointments}
              appointments={appointments}
            />
          </>
        );
      case "Appointments":
        return (
          <Appointments
            appointments={appointments}
            doctor={doctor}
            dispatchCancelAppointement={dispatchCancelAppointement}
          />
        );
      case "Available Timings":
        return <AvailableTimings doctor={doctor} />;
      case "Reviews":
        return <Patients doctor={doctor} />;
      case "Settings":
        return <Settings doctor={doctor} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-gray-500">Coming Soon...</h2>
          </div>
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
          <Profile />
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

export default DoctorDashbord;
