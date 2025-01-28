const appointmentshard = [
  {
    id: 1,
    name: "Emma Thompson",
    time: "09:00 AM",
    type: "General Checkup",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    status: "Upcoming",
    duration: "30 mins",
  },
  {
    id: 2,
    name: "Michael Chen",
    time: "10:30 AM",
    type: "Follow-up",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "In Progress",
    duration: "45 mins",
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    time: "02:00 PM",
    type: "Consultation",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "Upcoming",
    duration: "1 hour",
  },
  {
    id: 4,
    name: "James Wilson",
    time: "03:30 PM",
    type: "Emergency",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "Pending",
    duration: "1 hour",
  },
  {
    id: 5,
    name: "Olivia Brown",
    time: "04:45 PM",
    type: "Regular Checkup",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "Confirmed",
    duration: "30 mins",
  },
];
import { useState, useEffect } from "react";
import { gsap } from "gsap";


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
export default function Appointments({ patientappointments, patient }) {
  const [activeTab, setActiveTab] = useState("Today"); // State to handle active tab (Today, Upcoming, Past)
  console.log(patientappointments);
//   appointments = appointmentshard;
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

  // Helper function to convert time to 24-hour format for sorting
  // Helper function to convert time to 24-hour format for sorting
  const convertTo24HourFormat = (timeSlot) => {
    const [time, period] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (period === "PM" && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
    if (period === "AM" && hours === 12) hours = 0; // Convert 12 AM to 00:00
  
    return hours * 100 + minutes; // Convert to HHMM format for easier comparison
  };
  

  // Filter appointments based on the selected tab
  const filteredAppointments = patientappointments?.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();

    if (activeTab === "Today") {
      return appointmentDate.toDateString() === today.toDateString();
    } else if (activeTab === "Upcoming") {
      return appointmentDate > today;
    } else if (activeTab === "Past") {
      return appointmentDate < today;
    }
    return true;
  });

  // Sort today's appointments by time slot
  const sortedAppointments = filteredAppointments.sort((a, b) => {
     // Sort by Date
     const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (dateA !== dateB) {
      return dateA - dateB; // Date comparison
    }
 
    const timeA = convertTo24HourFormat(a.timeSlot);
    const timeB = convertTo24HourFormat(b.timeSlot);
    return timeA - timeB;
  });

  // Function to get the class for the active tab button
  const getButtonClass = (tab) => {
    return activeTab === tab
      ? "px-4 py-2 bg-primary text-white rounded-lg"
      : "px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="appointments-title text-2xl font-bold">
            Appointments
          </h1>
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
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="appointments-list space-y-4">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                {appointment.doctor?.profileImageUrl ? (
                  <img
                    src={appointment.doctor?.profileImageUrl}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  // Fallback to initials if no profile image
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-300 text-white font-bold cursor-pointer">
                    {appointment.doctor?.name.slice(0, 2).toUpperCase() ||
                      "User"}
                  </span>
                )}
                <div>
                  <h4 className="font-medium">{appointment.doctor?.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{appointment.time}</span>
                    <span>
                      {appointment.date &&
                        new Date(appointment.date).toLocaleDateString("en-CA")}
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
                <button className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors">
                  Add Review 
                </button>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

