import profileimg from "../../../assets/patient.png";
import { useEffect } from "react";
import moment from "moment-timezone";
import gsap from "gsap";

import { convertTo24HourFormat } from "../../../Helpers/convertTo24HourFormat";

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

  
  const istDate = moment().tz("Asia/Kolkata");
  const todayIST = istDate.format("YYYY-MM-DD");
  const currentTime = istDate.hours() * 100 + istDate.minutes();

  // console.log("Today IST: ", todayIST);
  // console.log("Current Time in IST: ", currentTime);
  const filteredAppointments = appointments?.filter((appointment) => {
    const appointmentTime = convertTo24HourFormat(appointment.timeSlot);
    const appointmentDate = appointment.date.split("T")[0];
    return appointmentDate === todayIST && appointmentTime > currentTime;
  });

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const timeA = convertTo24HourFormat(a.timeSlot);
    const timeB = convertTo24HourFormat(b.timeSlot);

    return timeA - timeB;
  });

  useEffect(() => {
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
