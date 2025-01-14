import React from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const DoctorProfile = ({ doctor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-8">
        {/* Doctor's Image */}
        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-md">
          <img
            src={doctor.profileImageUrl || "https://placekitten.com/300/300"} // Use doctor image or fallback
            alt={doctor.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Doctor's Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
              <p className="text-gray-600 mt-1">{doctor.specialization}</p>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                  <span className="mr-1">🦷</span>
                  {doctor.specialization}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">99%</div>
              <div className="text-gray-600">35 Feedback</div>
              <div className="text-gray-600 mt-1">{doctor.clinicaddress || "New York, USA"}</div>
              <div className="text-lg font-semibold text-blue-600 mt-1">${doctor.consultationFee || "100"} per hour</div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mt-4">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4].map((star) => (
                <FaStar key={star} className="w-5 h-5" />
              ))}
              <FaStar className="w-5 h-5 text-gray-300" />
            </div>
            <span className="ml-2 text-gray-600">(35)</span>
          </div>

          {/* Location */}
          <div className="flex items-center mt-3">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="ml-2 text-gray-600">{doctor.clinicaddress || "New York, USA"}</span>
            <span className="ml-2 text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
              - Get Directions
            </span>
          </div>

          {/* Gallery */}
          <div className="flex gap-3 mt-6">
            {[1, 2, 3, 4].map((img) => (
              <div key={img} className="w-20 h-20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  src={`https://placekitten.com/100/100?image=${img}`}
                  alt={`Gallery ${img}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="flex gap-3 mt-6">
            {doctor.specialization === "Dentist" && (
              <>
                <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Dental Fillings
                </span>
                <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Teeth Whitening
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Booking Buttons */}
      <div className="flex gap-6 mt-8">
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
          Book In-Person Visit
        </button>
        <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300">
          Book Video Consultation
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
