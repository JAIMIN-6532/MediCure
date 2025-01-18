import { FaCheckCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function BookingConfirmation({ booking,patient, onViewInvoice }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-green-500 rounded-full opacity-25 animate-pulse"></div>
            <FaCheckCircle className="text-green-500 text-6xl relative z-10" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Appointment booked Successfully!
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 text-primary font-semibold mb-4">
            <FaCalendarAlt />
            <span>Appointment Details</span>
          </div>
          
          <p className="text-xl font-semibold text-gray-800 mb-2">
            {booking.doctorName}
          </p>
          
          <div className="flex items-center justify-center gap-6 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <FaClock className="text-primary" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              <span>{booking.date}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-primary" />
            <span>Newyork, USA</span>
          </div>
        </div>
        
        <button
          onClick={onViewInvoice}
          className="px-8 py-4 bg-primary text-white rounded-lg font-semibold w-full
                   hover:bg-blue-600 transition-all transform hover:scale-105 focus:outline-none 
                   focus:ring-2 focus:ring-primary focus:ring-opacity-50 shadow-lg"
        >
          View Invoice
        </button>
      </div>
    </div>
  );
}