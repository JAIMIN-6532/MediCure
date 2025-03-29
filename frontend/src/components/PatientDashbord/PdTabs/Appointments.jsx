//sample date for checking how it willl looks like.....

// const appointmentshard = [
//   {
//     id: 1,
//     name: "Emma Thompson",
//     time: "09:00 AM",
//     type: "General Checkup",
//     image:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
//     status: "Upcoming",
//     duration: "30 mins",
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     time: "10:30 AM",
//     type: "Follow-up",
//     image:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
//     status: "In Progress",
//     duration: "45 mins",
//   },
//   {
//     id: 3,
//     name: "Sofia Rodriguez",
//     time: "02:00 PM",
//     type: "Consultation",
//     image:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
//     status: "Upcoming",
//     duration: "1 hour",
//   },
//   {
//     id: 4,
//     name: "James Wilson",
//     time: "03:30 PM",
//     type: "Emergency",
//     image:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
//     status: "Pending",
//     duration: "1 hour",
//   },
//   {
//     id: 5,
//     name: "Olivia Brown",
//     time: "04:45 PM",
//     type: "Regular Checkup",
//     image:
//       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
//     status: "Confirmed",
//     duration: "30 mins",
//   },
// ];

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";
import moment from "moment-timezone";

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

export default function Appointments({ patientappointments, patient }) {
  const [activeTab, setActiveTab] = useState("Today");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  console.log(patientappointments);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleReviewClick = (appointment) => {
    console.log("Appointment selected:", appointment);
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const onClose = () => {
    console.log("Closing modal");
    setShowModal(false);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitReview = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/feedback/addfeedback`,
        {
          rating,
          comment,
          doctor: selectedAppointment.doctor,
          patient: selectedAppointment.patient,
        }
      );

      console.log("Review submitted:", response.data);
      toast.success("Review added successfully!");
      setShowModal(false);

      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review.");
    }
  };

  const isPastAppointment = (appointmentDate) => {
    const today = new Date();
    const appointmentDateObj = new Date(appointmentDate);
    return appointmentDateObj < today; // returns true if the appointment is in the past
  };

  const convertTo24HourFormat = (timeSlot) => {
    const [time, period] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12; // convert PM hours to 24-hour format..
    if (period === "AM" && hours === 12) hours = 0; // convert 12 AM to 00:00...

    return hours * 100 + minutes; // Convert HHMM format for easier comparison
  };

  const filteredAppointments = patientappointments?.filter((appointment) => {
    const appointmentDate = appointment.date.split("T")[0]; // get date part only (YYYY-MM-DD)

    const today = new Date(); //utc date

    const appointmentTime = convertTo24HourFormat(appointment.timeSlot);
    const istDate = moment().tz("Asia/Kolkata");
    const todayIST = istDate.format("YYYY-MM-DD");
    const currentTime = istDate.hours() * 100 + istDate.minutes(); // convert current time to 24-hour format

    console.log("Today IST: ", todayIST);
    if (activeTab === "Today") {
      return appointmentDate === todayIST && appointmentTime >= currentTime; // Compare only the date part (date in IST)
    } else if (activeTab === "Upcoming") {
      return appointmentDate > todayIST;
    } else if (activeTab === "Past") {
      return (
        appointmentDate < todayIST ||
        (appointmentDate == todayIST && appointmentTime < currentTime)
      ); // Past appointments (past dates)
    }

    return true;
  });

  // sort today's appointments by date and time slot
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = a.date.split("T")[0];
    const dateB = b.date.split("T")[0];

    if (dateA !== dateB) {
      return dateA.localeCompare(dateB); // sort by date
    }

    const timeA = convertTo24HourFormat(a.timeSlot);
    const timeB = convertTo24HourFormat(b.timeSlot);

    return timeA - timeB; // sort by time (ascending)
  });

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
              key={appointment?._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                {appointment?.doctor?.profileImageUrl ? (
                  <img
                    src={appointment?.doctor?.profileImageUrl}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-300 text-white font-bold cursor-pointer">
                    {appointment?.doctor.slice(0, 2).toUpperCase() || "User"}
                  </span>
                )}
                <div>
                  <h4 className="font-medium">{appointment.doctor?.name}</h4>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <h5 className="font-medium">{appointment.doctor?.email}</h5>
                    <span>{appointment?.time}</span>
                    <span>
                      {appointment?.date &&
                        appointment.date
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}{" "}
                    </span>
                    <span>{appointment?.timeSlot}</span>
                    <span>•</span>
                    <span>{appointment?.type}</span>
                    <span>•</span>
                    <span>30 Min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    appointment?.status
                  )}`}
                >
                  {appointment?.status}
                </span>
                {isPastAppointment(appointment?.date) && (
                  <button
                    className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={() => handleReviewClick(appointment)}
                  >
                    Add Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* modal forr review */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
          />

          <div className="min-h-screen px-4 text-center">
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl animate-scaleIn">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                  Rate Your Experience
                </h2>

                <div className="flex justify-center mb-8 space-x-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-hover focus:outline-none ${
                        star <= rating
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                      onClick={() => handleRatingChange(star)}
                    >
                      <svg
                        className="w-12 h-12 transition-all duration-300 transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  ))}
                </div>

                <p className="text-lg font-medium text-gray-600 mb-6">
                  {rating === 0
                    ? "Select your rating"
                    : `You rated ${rating} star${rating !== 1 ? "s" : ""}`}
                </p>

                <div className="relative mb-8">
                  <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Share your experience with us..."
                    rows="4"
                    maxLength={500}
                    className="w-full p-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl shadow-sm transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
                    placeholder-gray-400 resize-none"
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    {comment.length}/500
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg transition-all duration-300
                    hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-all duration-300
                    hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transform hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                    onClick={handleSubmitReview}
                    disabled={rating === 0}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
