// import React from 'react';
// import { FaStar } from 'react-icons/fa';

// const LocationCard = ({ name, address, rating, hours, fees }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">{name}</h3>
//           <p className="text-gray-600 mt-1">MDS - Periodontology and Oral Implantology, BDS</p>
          
//           <div className="flex items-center mt-3">
//             <div className="flex text-yellow-400">
//               {Array(4).fill().map((_, i) => (
//                 <FaStar key={i} className="w-5 h-5" />
//               ))}
//               <FaStar className="w-5 h-5 text-gray-300" />
//             </div>
//             <span className="ml-2 text-gray-600">(4)</span>
//           </div>

//           <p className="text-gray-600 mt-3">{address}</p>
//           <button className="text-blue-500 hover:text-blue-600 font-medium mt-2 transition-colors">
//             Get Directions
//           </button>
//         </div>

//         <div className="text-right">
//           <div className="text-3xl font-bold text-blue-600">${fees}</div>
//           <button className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
//             Book Now
//           </button>
//         </div>
//       </div>

//       <div className="mt-6">
//         <div className="flex gap-3 mb-6">
//           {[1, 2, 3, 4].map((img) => (
//             <div key={img} className="w-20 h-20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
//               <img
//                 src={`https://placekitten.com/100/100?image=${img + 4}`}
//                 alt={`Clinic ${img}`}
//                 className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//               />
//             </div>
//           ))}
//         </div>

//         <div className="border-t pt-6">
//           {Object.entries(hours).map(([day, time]) => (
//             <div key={day} className="flex justify-between text-sm mb-3">
//               <span className="font-medium text-gray-700">{day}</span>
//               <span className="text-gray-600">{time}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationCard;