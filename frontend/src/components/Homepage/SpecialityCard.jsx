// import React from "react";

// const SpecialtyCard = ({ backgroundImage, icon, title }) => {
//   return (
//     <div
//       className="w-full sm:w-[17%] min-w-[200px] h-[80%] flex justify-center items-center bg-cover bg-center bg-no-repeat rounded-lg relative z-10"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>

//       {/* Image inside a circular container */}
//       <div className="w-[130px] z-10 flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//         <div className="bg-white p-2 rounded-lg w-[80px] h-[80px]">
//           <img src={icon} alt={`${title} Icon`} className="w-full h-full object-contain" />
//         </div>
//         <h2 className="text-2xl font-semibold text-white">{title}</h2>
//       </div>
//     </div>
//   );
// };

// export default SpecialtyCard;


// import { FaTooth, FaBrain, FaHeartbeat, FaBone, FaStethoscope } from 'react-icons/fa';
// import cardiology from "../../assets/cardio.jpeg";
// import neurology from "../../assets/neuro.jpeg";
// import orthopedic from "../../assets/ortho.jpeg";
// import dentist from "../../assets/dentist.jpeg";
// import urologyimg from "../../assets/urology.jpeg";

// const specialties = [
//   {
//     icon: FaTooth,
//     name: 'Dentist',
//     bgImage: dentist
//   },
//   {
//     icon: FaBrain,
//     name: 'Neurology',
//     bgImage: neurology
//   },
//   {
//     icon: FaHeartbeat,
//     name: 'Cardiology',
//     bgImage: cardiology
//   },
//   {
//     icon: FaBone,
//     name: 'Orthopedic',
//     bgImage: orthopedic
//   },
//   {
//     icon: FaStethoscope,
//     name: 'Urology',
//     bgImage: urologyimg
//   },
// ];

// const SpecialityCard = () => {
//   return (
//     <div className="py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-dark-blue mb-4">Clinic & Specialities</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Discover our wide range of medical specialties and expert healthcare providers
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//           {specialties.map((specialty, index) => (
//             <div
//               key={index}
//               className="relative h-[300px] rounded-xl overflow-hidden hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer group"
//             >
//               {/* Background Image */}
//               <div 
//                 className="absolute inset-0 bg-cover bg-center"
//                 style={{ 
//                   backgroundImage: `url(${specialty.bgImage})`,
//                 }}
//               />
//               {/* Overlay */}
//               <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all" />
              
//               {/* Content */}
//               <div className="relative h-full flex flex-col items-center justify-center text-white z-10 ">
//                 <div className="bg-white p-2 bg-white border-2 border-white rounded-md">
//                 <specialty.icon className="text-4xl text-blue-500 " />
//                 </div>
                
//                 <h3 className="text-lg font-bold">{specialty.name}</h3>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <button className="bg-primary-blue text-white px-8 py-3 rounded-full hover:bg-dark-blue transition-colors">
//             Browse All Categories
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpecialityCard;
import { FaTooth, FaBrain, FaHeartbeat, FaBone, FaStethoscope } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

// ... keep existing image imports the same ...

const SpecialityCard = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Keep the header section the same */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-blue mb-4">Clinic & Specialities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of medical specialties and expert healthcare providers
          </p>
        </div>

        {/* Replace grid with Swiper carousel */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {specialties.map((specialty, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[300px] rounded-xl overflow-hidden hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer group">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${specialty.bgImage})`,
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-white z-10">
                  <div className="bg-white p-2 border-2 border-white rounded-md">
                    <specialty.icon className="text-4xl text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold mt-2">{specialty.name}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Keep the button section the same */}
        <div className="text-center mt-12">
          <button className="bg-primary-blue text-white px-8 py-3 rounded-full hover:bg-dark-blue transition-colors">
            Browse All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialityCard;