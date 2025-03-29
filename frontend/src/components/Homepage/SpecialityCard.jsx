import { FaTooth, FaBrain, FaHeartbeat, FaBone, FaStethoscope } from 'react-icons/fa';
import cardiology from "../../assets/cardio.jpeg";
import neurology from "../../assets/neuro.jpeg";
import orthopedic from "../../assets/ortho.jpeg";
import dentist from "../../assets/dentist.jpeg";
import urologyimg from "../../assets/urology.jpeg";
import './Card.css';
const specialties = [
  {
    icon: FaTooth,
    name: 'Dentist',
    bgImage: dentist
  },
  {
    icon: FaBrain,
    name: 'Neurology',
    bgImage: neurology
  },
  {
    icon: FaHeartbeat,
    name: 'Cardiology',
    bgImage: cardiology
  },
  {
    icon: FaBone,
    name: 'Orthopedic',
    bgImage: orthopedic
  },
  {
    icon: FaStethoscope,
    name: 'Urology',
    bgImage: urologyimg
  },
];

const SpecialityCard = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-dark-blue mb-4">Clinic & Specialities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of medical specialties and expert healthcare providers
          </p>
        </div>

        <div className="specialty-slider">
          <div className="specialty-track">
            {/* 4 times  the array for infinite effect */}
            {[...specialties, ...specialties, ...specialties, ...specialties].map((specialty, index) => (
              <div key={`${specialty.name}-${index}`} className="specialty-slide">
                <div className="relative h-[300px] rounded-xl overflow-hidden hover:shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer group">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${specialty.bgImage})`,
                    }}
                  />
                  {/* Overlay forr wraping text into it */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-white z-10">
                    <div className="bg-white p-2 border-2 border-white rounded-md">
                      <specialty.icon className="text-4xl text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold mt-2">{specialty.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpecialityCard;
