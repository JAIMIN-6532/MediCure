import { FaStar } from 'react-icons/fa';

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    price: 150,
    image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    rating: 4.9,
    price: 180,
    image: 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg',
  },
  {
    name: 'Dr. Emily Brown',
    specialty: 'Dentist',
    rating: 4.7,
    price: 120,
    image: 'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827775.jpg',
  },
];

const DoctorCard = () => {
  return (
    <div className="bg-light-blue py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-blue mb-4">Our Expert Doctors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book appointments with the best doctors and specialists in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover " />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-dark-blue mb-2">{doctor.name}</h3>
                <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400" />
                  <span className="ml-1 text-gray-600">{doctor.rating}</span>
                </div>
                <p className="text-primary-blue font-semibold mb-4">${doctor.price} / Consultation</p>
                <hr />
                <div className="flex space-x-4 mt-[15px]">
                  <button className="flex-1 bg-light-blue text-primary-blue px-4 py-2 rounded-full hover:bg-primary-blue hover:text-white transition-colors">
                    View Profile
                  </button>
                  <button className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-full hover:bg-dark-blue transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;