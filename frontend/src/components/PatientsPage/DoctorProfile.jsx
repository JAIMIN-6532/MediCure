import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Video,
  MapPin,
  Star,
  Clock,
  Stethoscope,
  Building,
} from "lucide-react";

function ServiceTypeBadge({ type }) {
  return (
    <div className="flex gap-2">
      {(type === "Online" || type === "Both") && (
        <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <Video className="w-4 h-4 mr-1" />
          Online
        </span>
      )}
      {(type === "Offline" || type === "Both") && (
        <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          In-person
        </span>
      )}
    </div>
  );
}
const DoctorProfile = ({ doctor, avgRating }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { doctorId } = useParams();

  const handleBookAppointment = () => {
    if (!token) {
      localStorage.setItem("redirect", `/bookappointment/${doctorId}`);
      navigate("/signin");
    } else {
      navigate(`/bookappointment/${doctorId}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="md:w-1/3">
          <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
            <div className="w-full h-full">
              <img
                src={doctor.profileImageUrl}
                alt={doctor.name}
                className="w-full h-full object-cover  transition-all duration-300 ease-in-out transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="space-y-2 font-semibold mt-4 ml-2">
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              <span>{doctor.experience} Years Experience</span>
            </div>
            {(doctor?.city || doctor?.state) && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  {doctor.city} {doctor.state}
                </span>
              </div>
            )}
            {doctor.clinicaddress && (
              <div className="text-gray-600 text-sm mt-2 flex items-center">
                <Building className="w-4 h-4 mr-2" />{" "}
                <span>{doctor.clinicaddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {doctor.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">{doctor.specialization}</span>
              </div>
            </div>
            <ServiceTypeBadge type={doctor.serviceType} />
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {<FaStar className="w-5 h-5 text-yellow-400" />}
            <span className="ml-2 text-gray-600">
              ({avgRating?.toFixed(2)})/5
            </span>
          </div>

          {/* Consultation Fee */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-lg font-semibold text-blue-600">
              Consultation Fee: ₹ {doctor.consultationFee}
            </div>
          </div>

          {/* Book Appointment Button */}
          <button
            onClick={handleBookAppointment}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
