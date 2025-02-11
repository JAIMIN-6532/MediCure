const appointments = [
  {
    id: 1,
    name: "Emma Thompson",
    time: "09:00 AM",
    type: "General Checkup",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Michael Chen",
    time: "10:30 AM",
    type: "Follow-up",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    time: "02:00 PM",
    type: "Consultation",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "Scheduled",
  },
];
import profileimg from "../../../assets/patient.png";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import gsap from "gsap";

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-50 text-green-600";
    case "In Progress":
      return "bg-blue-50 text-blue-600";
    case "Scheduled":
      return "bg-yellow-50 text-yellow-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

export default function AppointmentList({ appointments }) {
  // console.log("Appointments: ", appointments);

  const convertTo24HourFormat = (timeSlot) => {
    const [time, period] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
    if (period === "AM" && hours === 12) hours = 0; // Convert 12 AM to 00:00

    return hours * 100 + minutes; // Convert to HHMM format for easier comparison
  };

  // Get current IST date and time
  const istDate = moment().tz("Asia/Kolkata");
  const todayIST = istDate.format("YYYY-MM-DD"); // Get today's date in IST (YYYY-MM-DD)
  const currentTime = istDate.hours() * 100 + istDate.minutes(); // Convert current time to 24-hour format

  console.log("Today IST: ", todayIST);
  console.log("Current Time in IST: ", currentTime);
  // Filter appointments based on today's date
  const filteredAppointments = appointments?.filter((appointment) => {
    const appointmentTime = convertTo24HourFormat(appointment.timeSlot); // Convert time slot to 24-hour format

    console.log("currentTime", currentTime);
    console.log("appointmentTime", appointmentTime);
    // Extract the date part (YYYY-MM-DD) from appointment.date
    const appointmentDate = appointment.date.split("T")[0]; // Get the date part only (YYYY-MM-DD)
    return appointmentDate === todayIST && appointmentTime > currentTime; // Only include appointments for today
  });

  // Sort today's appointments by time slot
  // onFilteredAppointments(filteredAppointments);
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const timeA = convertTo24HourFormat(a.timeSlot); // Convert time slot to 24-hour format
    const timeB = convertTo24HourFormat(b.timeSlot); // Convert time slot to 24-hour format

    return timeA - timeB; // Sort by time (ascending)
  });

  useEffect(() => {
    // Animate each appointment item when they appear

    sortedAppointments.forEach((appointment, index) => {
      gsap.fromTo(
        `.appointment-${appointment._id}`,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          delay: index * 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    });
  }, [appointments]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Today's Appointments</h2>
          <p className="text-gray-500 text-sm mt-1">
            You have next {filteredAppointments.length} appointments today
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className={`appointment-${appointment._id} flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100`}
          >
            <div className="flex items-center gap-4">
              <img
                src={appointment.profileImageUrl || profileimg}
                alt={appointment?.patient?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium">{appointment?.patient.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-bold text-blue-600">
                    {appointment?.timeSlot}
                  </span>
                  <span className="text-bold">•</span>
                  <span className="text-bold">
                    {appointment?.type === "Offline" ? "In-person" : "Online"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
              {appointment.type === "Online" && (
                <button className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors">
                  Start Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
