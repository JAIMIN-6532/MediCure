// import React from "react";
// import doctorimage from "../assets/homedoctor.png";
// import urologyimg from "../assets/urology.jpeg";
// import "./home.css";
// import kedney from "../assets/kedney.svg";
// import cardiology from "../assets/cardio.jpeg";
// import neurology from "../assets/neuro.jpeg";
// import orthopedic from "../assets/ortho.jpeg";
// import dentist from "../assets/dentist.jpeg";
// import Navbar from "../components/Navbar";
// import DoctorCard from "../components/DoctorCard";
// import SpecialtyCard from "../components/SpecialityCard";

// const HomePage = () => {
//   return (
//     <>
//       <div className="w-full h-full flex flex-col gap-[30px]">
//         <div className="container2 flex flex-col md:flex-row items-center justify-between w-full h-[70vh] p-[7%] overflow-hidden bg-[#e8f6ff]">
//           <div className="left w-full md:w-1/2">
//             <h2 className="first font-bold text-3xl md:text-5xl text-[#0e82fd] leading-[60px]">
//               Search Doctors,
//             </h2>
//             <h2 className="second font-bold text-3xl md:text-5xl text-[#002578]">
//               Make an Appointment
//             </h2>
//             <p className="third text-lg mt-5 text-[#586371]">
//               Access to expert physicians and surgeons, advanced technologies
//               and top-quality surgery facilities right here.
//             </p>
//             <button className="btnfinddoctor bg-[#0e82fd] text-white text-lg py-2 px-7 rounded-lg border-2 border-[#0e82fd] mt-5 cursor-pointer hover:bg-white hover:text-[#0065ca] hover:border-[#0065ca] transition-all ease-in-out duration-200">
//               Find Doctors
//             </button>
//           </div>
//           <div className="right w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
//             <img
//               src={doctorimage}
//               alt="doctor image"
//               className="homedoctor w-[80%] md:w-[95%] max-w-md"
//             />
//           </div>
//         </div>

//         <div className="mt-15 h-auto w-full pt-[2%] pl-[7%]">
//           <div>
//             <h1 className="text-3xl md:text-4xl text-gray-900 font-bold">
//               Clinic & Specialities
//             </h1>
//             <p className="third text-lg md:text-[20px] mt-2 ml-1 text-[#586371]">
//               Find experienced doctors across all specialties.
//             </p>
//           </div>
//           <div className="flex flex-col items-center justify-center">
//             <div className="h-[60vh] flex gap-5 flex-wrap w-full mt-[3%]">
//               <SpecialtyCard
//                 backgroundImage={urologyimg}
//                 icon={kedney}
//                 title="Urology"
//               />
//               <SpecialtyCard
//                 backgroundImage={neurology}
//                 icon={kedney}
//                 title="Neurology"
//               />
//               <SpecialtyCard
//                 backgroundImage={cardiology}
//                 icon={kedney}
//                 title="Cardiology"
//               />
//               <SpecialtyCard
//                 backgroundImage={dentist}
//                 icon={kedney}
//                 title="Dentist"
//               />
//               <SpecialtyCard
//                 backgroundImage={orthopedic}
//                 icon={kedney}
//                 title="Orthopedic"
//               />
//             </div>
//             <button className="mt-5 bg-[#0e82fd] text-white text-lg py-2 px-7 rounded-lg border-2 border-[#0e82fd] mt-5 cursor-pointer hover:bg-white hover:text-[#0065ca] hover:border-[#0065ca] transition-all ease-in-out duration-200">
//               Browse All Categories
//             </button>
//           </div>
//         </div>

//         <div className="w-full pl-[7%]">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Book Best Doctors</h1>
//           <p className="third text-lg text-[#586371]">Meet our experts & book online.</p>

//           <div className="flex mt-10 flex-wrap gap-[50px] justify-center">
//             <DoctorCard
//               doctorImage={doctorimage}
//               name="Dr. John Doe"
//               rating={5}
//               category="Cardiologist"
//               price="$200"
//             />
//             <DoctorCard
//               doctorImage={doctorimage}
//               name="Dr. Jane Smith"
//               rating={4}
//               category="Neurologist"
//               price="$150"
//             />
//             <DoctorCard
//               doctorImage={doctorimage}
//               name="Dr. Alice Brown"
//               rating={4}
//               category="Orthopedic"
//               price="$180"
//             />
//             <DoctorCard
//               doctorImage={doctorimage}
//               name="Dr. Alice Brown"
//               rating={4}
//               category="Orthopedic"
//               price="$180"
//             />
//           </div>
//         </div>

//         <div className="w-full h-[30px] pl-[7%] bg-[#f9f9f9] mt-[10px]"></div>
//       </div>
//     </>
//   );
// };

// export default HomePage;


import Home from '../components/Homepage/Home';

const HomePage = () => {
  return <Home />;
};

export default HomePage;