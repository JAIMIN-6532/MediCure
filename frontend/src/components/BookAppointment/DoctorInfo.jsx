import { FaStar, FaMapMarkerAlt, FaClock, FaStethoscope, FaDollarSign } from 'react-icons/fa';

export default function DoctorInfo({ doctor }) {
  console.log("doctor inside Info",doctor);
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slide-up hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img
            src={doctor.profileImageUrl}
            alt={doctor.name}
            className="w-40 h-40 rounded-2xl object-cover shadow-lg transition-transform hover:scale-105"
          />
          <div className="absolute -bottom-3 -right-3 bg-secondary text-white p-2 rounded-lg shadow-lg">
            <FaStethoscope className="text-xl" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{doctor.specialization}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl ${
                    i < Math.floor(doctor.rating || 2)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-gray-600 ml-2">({doctor.reviews || 2} reviews)</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <FaMapMarkerAlt className="text-primary" />
              <span>{doctor.city || doctor.clinicaddress}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <FaClock className="text-primary" />
              <span>{doctor.experience}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center bg-gray-50 p-6 rounded-xl">
          <p className="text-sm text-gray-600 mb-2 flex items-center justify-center gap-2">
            {/* <FaDollarSign className="text-primary" /> */}
            <span className='text-primary text-2xl font-bold'>₹</span> Consultation Fee
          </p>
          <p className="text-3xl font-bold text-primary">{doctor.consultationFee}</p>
          <p className="text-sm text-gray-500 mt-2">per visit</p>
        </div>
      </div>
    </div>
  );
}