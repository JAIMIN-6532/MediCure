// import React, { useState } from "react";
// import { Search, Star, MapPin, Calendar, Video } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { selectAllDoctors } from "../../reduxToolkit/reducers/DoctorReducer";
// import { fetchDoctors } from "../../reduxToolkit/reducers/DoctorReducer";
// import { useEffect } from "react";

// const specialties = [
//   "Cardiologist",
//   "Neurologist",
//   "Pediatrician",
//   "Dermatologist",
//   "Orthopedic",
// ];
// const consultationTypes = ["Online", "In-person"];

// function DoctorsList() {
//   const dispatch = useDispatch();

//   const { doctors, status, error } = useSelector((state) => state.doctors);

//   const [searchCity, setSearchCity] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filters, setFilters] = useState({
//     gender: "",
//     specialty: "",
//     consultationType: "",
//     minFee: "",
//     maxFee: "",
//     minRating: 0,
//   });

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchDoctors());
//     }
//   }, [dispatch, status]);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <Star
//         key={index}
//         className={`w-4 h-4 ${
//           index < Math.floor(rating)
//             ? "text-yellow-400 fill-yellow-400"
//             : "text-gray-300"
//         }`}
//       />
//     ));
//   };

//   // Calculate average rating from feedbacks
//   const calculateAverageRating = (feedbacks) => {
//     if (feedbacks && feedbacks.length > 0) {
//       const totalRating = feedbacks.reduce(
//         (sum, feedback) => sum + feedback.rating,
//         0
//       );
//       return totalRating / feedbacks.length;
//     }
//     return 0; // Return 0 if no feedbacks
//   };

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   const doctorsPerPage = 5;
//   const totalPages = Math.ceil(doctors.length / doctorsPerPage);

//   return (
//     <div className="container mx-auto px-4 py-8 pt-[70px]">
//       {/* Search Bar */}
//       <div className="relative mb-8">
//         <input
//           type="text"
//           placeholder="Search by city..."
//           className="w-full p-4 pl-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//           value={searchCity}
//           onChange={(e) => setSearchCity(e.target.value)}
//         />
//         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//       </div>

//       <div className="flex gap-8">
//         {/* Filters Sidebar */}
//         <div className="w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
//           <h2 className="text-xl font-semibold mb-6">Filters</h2>

//           {/* Gender Filter */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-3">Gender</h3>
//             <select
//               className="w-full p-2 border rounded-md"
//               value={filters.gender}
//               onChange={(e) => handleFilterChange("gender", e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           </div>

//           {/* Specialty Filter */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-3">Specialty</h3>
//             <select
//               className="w-full p-2 border rounded-md"
//               value={filters.specialty}
//               onChange={(e) => handleFilterChange("specialty", e.target.value)}
//             >
//               <option value="">All</option>
//               {specialties.map((specialty) => (
//                 <option key={specialty} value={specialty}>
//                   {specialty}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Consultation Type */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-3">Consultation Type</h3>
//             <select
//               className="w-full p-2 border rounded-md"
//               value={filters.consultationType}
//               onChange={(e) =>
//                 handleFilterChange("consultationType", e.target.value)
//               }
//             >
//               <option value="">All</option>
//               {consultationTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Fee Range */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-3">Consultation Fee</h3>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 className="w-1/2 p-2 border rounded-md"
//                 value={filters.minFee}
//                 onChange={(e) => handleFilterChange("minFee", e.target.value)}
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 className="w-1/2 p-2 border rounded-md"
//                 value={filters.maxFee}
//                 onChange={(e) => handleFilterChange("maxFee", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Rating Filter */}
//           <div className="mb-6">
//             <h3 className="font-medium mb-3">Minimum Rating</h3>
//             <div className="flex gap-1">
//               {[1, 2, 3, 4, 5].map((rating) => (
//                 <button
//                   key={rating}
//                   onClick={() => handleFilterChange("minRating", rating)}
//                   className={`p-2 ${
//                     filters.minRating >= rating
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 >
//                   <Star className="w-6 h-6 fill-current" />
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Doctors Grid */}
//         <div className="w-3/4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {doctors
//               .slice(
//                 (currentPage - 1) * doctorsPerPage,
//                 currentPage * doctorsPerPage
//               )
//               .map((doctor) => {
//                 const averageRating = calculateAverageRating(doctor.feedbacks);

//                 return (
//                   <div
//                     key={doctor.id}
//                     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                   >
//                     <div className="flex p-6">
//                       <img
//                         src={doctor.profileImageUrl}
//                         alt={doctor.name}
//                         className="w-36 h-36 rounded-lg object-cover"
//                       />
//                       <div className="ml-4">
//                         <h3 className="text-lg font-semibold">{doctor.name}</h3>
//                         <p className="text-gray-600">{doctor.specialization}</p>
//                         <div className="flex items-center mt-2">
//                           {renderStars(averageRating)}
//                           <span className="ml-2 text-gray-600">
//                             ({averageRating.toFixed(1)})
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-4 mt-3">
//                           <div className="flex items-center text-gray-600">
//                             <MapPin className="w-4 h-4 mr-1" />
//                             {doctor.clinicaddress}
//                           </div>
//                           <div className="flex items-center text-gray-600">
//                             <Calendar className="w-4 h-4 mr-1 " />
//                             {doctor.experience}+ years
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-6 pb-6">
//                       <div className="flex items-center justify-between border-t pt-4">
//                         <div>
//                           <p className="text-gray-600">Consultation Fee</p>
//                           <p className="text-lg font-semibold">
//                             ${doctor.consultationFee}
//                           </p>
//                         </div>
//                         <div className="flex gap-2">
//                           {doctor.serviceType?.includes("Online") && (
//                             <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                               <Video className="w-4 h-4 mr-1" />
//                               Online
//                             </span>
//                           )}
//                           {doctor.serviceType?.includes("Offline") && (
//                             <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                               <MapPin className="w-4 h-4 mr-1" />
//                               In-person
//                             </span>
//                           )}
//                           {doctor.serviceType?.includes("Both") && (
//                             <>
//                               <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                                 <Video className="w-4 h-4 mr-1" />
//                                 Online
//                               </span>
//                               <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                                 <MapPin className="w-4 h-4 mr-1" />
//                                 In-person
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex space-x-4 mt-[15px]">
//                         <button className="flex-1 bg-light-blue text-primary-blue px-4 py-2 rounded-full hover:bg-primary-blue hover:text-white transition-colors">
//                           View Profile
//                         </button>
//                         <button className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-full hover:bg-dark-blue transition-colors">
//                           Book Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center items-center mt-8 gap-2">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
//             >
//               Previous
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`w-10 h-10 rounded-md ${
//                   currentPage === i + 1
//                     ? "bg-blue-500 text-white"
//                     : "border hover:bg-gray-50"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DoctorsList;

import React from 'react';
import DoctorsCardsDpage from '../../components/Doctorspage/DoctorsCardsDpage';

function DoctorsList() {
  return (
    <div >
      <DoctorsCardsDpage />
    </div>
  );
}

export default DoctorsList;
