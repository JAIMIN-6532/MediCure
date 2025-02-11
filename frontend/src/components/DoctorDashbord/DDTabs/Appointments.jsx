import moment from "moment-timezone";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Room from "../../../zegocloud/Room";
// Helper function to get status colors
const getStatusColor = (status) => {
  const colors = {
    Upcoming: "bg-blue-50 text-blue-600",
    "In Progress": "bg-yellow-50 text-yellow-600",
    Completed: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
    Pending: "bg-purple-50 text-purple-600",
    Confirmed: "bg-emerald-50 text-emerald-600",
  };
  return colors[status] || "bg-gray-50 text-gray-600";
};

// Appointments Component
export default function Appointments({
  appointments,
  doctor,
  dispatchCancelAppointement,
}) {
  const [activeTab, setActiveTab] = useState("Today"); // State to handle active tab (Today, Upcoming, Past)
  const [startRoom, setStartRoom] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  console.log(appointments);
  const navigate = useNavigate();
  useEffect(() => {
    gsap.fromTo(
      ".appointments-title",
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
    gsap.fromTo(
      ".appointments-list",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 }
    );
  }, []);

  // Handle tab change (Today, Upcoming, Past)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const convertTo24HourFormat = (timeSlot) => {
    const [time, period] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
    if (period === "AM" && hours === 12) hours = 0; // Convert 12 AM to 00:00

    return hours * 100 + minutes; // Convert to HHMM format for easier comparison
  };

  // Filter appointments based on the selected tab
  const filteredAppointments = appointments?.filter((appointment) => {
    // Extract the date part (YYYY-MM-DD) from appointment.date
    const appointmentDate = appointment.date.split("T")[0]; // Get the date part only (YYYY-MM-DD)

    // Get today's date in UTC (no time zone adjustment yet)
    // Get current IST date and time
    const istDate = moment().tz("Asia/Kolkata");
    const todayIST = istDate.format("YYYY-MM-DD"); // Get today's date in IST (YYYY-MM-DD)
    const currentTime = istDate.hours() * 100 + istDate.minutes(); // Convert current time to 24-hour format

    console.log("Today IST: ", todayIST);
    console.log("Current Time in IST: ", currentTime);
    // Convert appointment time slot to 24-hour format
    const appointmentTime = convertTo24HourFormat(appointment.timeSlot);

    // Create a new appointment object to avoid mutating the original object
    const appointmentCopy = { ...appointment };

    // Automatically mark appointments as "Past" if the time has passed
    if (
      appointmentDate < todayIST ||
      (appointmentDate === todayIST && appointmentTime < currentTime)
    ) {
      appointmentCopy.status = "Past"; // Modify the copy, not the original
    }
    console.log("Today IST: ", todayIST); // Debugging the IST date
    // Handle the different tabs
    if (activeTab === "Today") {
      return appointmentDate === todayIST && appointmentTime >= currentTime; // Compare only the date part (date in IST)
    } else if (activeTab === "Upcoming") {
      return appointmentDate > todayIST; // Upcoming appointments (future dates)
    } else if (activeTab === "Past") {
      return (
        appointmentDate < todayIST ||
        (appointmentDate === todayIST && appointmentTime < currentTime)
      ); // Past appointments (before current time)
    }

    return true;
  });

  // Sort today's appointments by date and time slot
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = a.date.split("T")[0];
    const dateB = b.date.split("T")[0];

    if (dateA !== dateB) {
      return dateA.localeCompare(dateB); // Sort by date
    }

    const timeA = convertTo24HourFormat(a.timeSlot); // Convert time slot to 24-hour format
    const timeB = convertTo24HourFormat(b.timeSlot); // Convert time slot to 24-hour format

    return timeA - timeB; // Sort by time (ascending)
  });

  console.log(sortedAppointments);

  // Function to get the class for the active tab button
  const getButtonClass = (tab) => {
    return activeTab === tab
      ? "px-4 py-2 bg-primary text-white rounded-lg"
      : "px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg";
  };

  const handleStartSession = async (appointmentId, patient) => {
    console.log("Start Session for appointment ID: ", appointmentId);
    const sendmail = await axios.post(
      `https://medicure-go5v.onrender.com/api/appointment/sendmail/${appointmentId}`,{
        patient,
      }
    );
    if (sendmail.data.success){
      console.log("Mail sent");
      // <Room appointmentId={appointmentId} />
      setStartRoom(true);
      setAppointmentId(appointmentId);
      navigate(`/room/${appointmentId}`);
      }
    else console.log("Mail not sent");
  };

  const handleCancelAppointement = async (appointmentId) => {
    console.log("Cancel Appointment for appointment ID: ", appointmentId);
    const res = await axios.post(
      `https://medicure-go5v.onrender.com/api/appointment/cancel/${appointmentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatchCancelAppointement();

    console.log("Cancel Appointment Response: ", res.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="appointments-title text-2xl font-bold">
            Appointments
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your appointments and schedule
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <button
            className={getButtonClass("Today")}
            onClick={() => handleTabChange("Today")}
          >
            Today
          </button>
          <button
            className={getButtonClass("Upcoming")}
            onClick={() => handleTabChange("Upcoming")}
          >
            Upcoming
          </button>
          <button
            className={getButtonClass("Past")}
            onClick={() => handleTabChange("Past")}
          >
            Past
          </button>
          <div className="flex-1"></div>
        </div>

        <div className="appointments-list space-y-4">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                {appointment.patient?.profileImageUrl ? (
                  <img
                    src={appointment.patient?.profileImageUrl}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  // Fallback to initials if no profile image
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-300 text-white font-bold cursor-pointer">
                    {appointment.patient?.name.slice(0, 2).toUpperCase() ||
                      "User"}
                  </span>
                )}
                <div>
                  <h4 className="font-medium">{appointment.patient?.name} </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-grey-600 font-semibold">
                      {appointment.patient?.email}
                    </span>
                    <span>{appointment.time}</span>
                    <span>
                      {appointment.date &&
                        appointment.date
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}{" "}
                    </span>
                    <span>{appointment.timeSlot}</span>
                    <span>•</span>
                    <span>{appointment.type}</span>
                    <span>•</span>
                    <span>30 Min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
                {(activeTab === "Today" || activeTab === "Upcoming") &&
                  appointment.status !== "Completed" &&
                  appointment.type === "Online" && (
                    <button
                      className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        handleStartSession(
                          appointment._id,
                          appointment.patient
                        );
                      }}
                    >
                      Start Session
                    </button>
                  )}
                {(activeTab === "Today" || activeTab === "Upcoming") &&
                  appointment.status !== "Completed" && (
                    <button
                      className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        handleCancelAppointement(appointment._id);
                      }}
                    >
                      Cancel Appointment
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}
