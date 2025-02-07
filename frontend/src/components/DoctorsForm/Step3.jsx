// import React from 'react';

// const Step3 = ({ formData, handleChange }) => {
//   // Days of the week
//   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   // Generate 30-minute interval time slots from 9:00 AM to 5:00 PM
//   const timeSlots = [];
//   let startTime = 9;
//   let endTime = 17; // 5 PM
//   while (startTime < endTime) {
//     timeSlots.push(`${startTime}:00`);
//     timeSlots.push(`${startTime}:30`);
//     startTime++;
//   }

//   // Handle day selection (toggle availability)
//   const handleDayClick = (day) => {
//     const newAvailability = formData.availability.includes(day)
//       ? formData.availability.filter((d) => d !== day)
//       : [...formData.availability, day];
//     handleChange({ target: { name: 'availability', value: newAvailability } });
//   };

//   // Handle time slot selection (toggle slot for a given day)
//   const handleSlotClick = (day, slot) => {
//     const newSlots = { ...formData.slots };

//     // If no slots exist for the day, initialize it as an empty array
//     if (!newSlots[day]) {
//       newSlots[day] = [];
//     }

//     // Add or remove the slot from the day's array of slots
//     if (newSlots[day].includes(slot)) {
//       newSlots[day] = newSlots[day].filter((s) => s !== slot); // Remove the slot
//     } else {
//       newSlots[day].push(slot); // Add the slot
//     }

//     handleChange({ target: { name: 'slots', value: newSlots } });
//   };

//   return (
//     <div className="space-y-8">
//       {/* Available Days Section */}
//       <div>
//         <label className="block text-lg font-medium text-gray-700 mb-4">Available Days</label>
//         <div className="flex flex-wrap gap-4">
//           {daysOfWeek.map((day) => (
//             <button
//               key={day}
//               type="button"
//               onClick={() => handleDayClick(day)}
//               className={`px-6 py-2 rounded-full text-sm font-medium ${
//                 formData.availability.includes(day)
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
//               } transition-all duration-200`}
//             >
//               {day}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Time Slots Section (Only for selected days) */}
//       {daysOfWeek.map((day) => (
//         formData.availability.includes(day) && (
//           <div key={day} className="mt-6">
//             <label className="block text-lg font-medium text-gray-700 mb-4">{day} Time Slots</label>
//             <div className="grid grid-cols-4 gap-4">
//               {timeSlots.map((slot) => (
//                 <button
//                   key={`${day}-${slot}`}
//                   type="button"
//                   onClick={() => handleSlotClick(day, slot)}
//                   className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                     formData.slots[day]?.includes(slot)
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
//                   }`}
//                 >
//                   {slot}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )
//       ))}

//       {/* Consultation Fee Section */}
//       <div>
//         <label className="block text-lg font-medium text-gray-700 mb-4">Consultation Fee (₹)</label>
//         <input
//           type="number"
//           name="consultationFee"
//           value={formData.consultationFee}
//           onChange={handleChange}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Enter consultation fee"
//         />
//       </div>
//     </div>
//   );
// };

// export default Step3;
import React from "react";
const Step3 = ({ formData, handleChange }) => {
  // Days of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Generate 30-minute interval time slots from 9:00 AM to 5:00 PM
  const timeSlots = [];
  let startTime = 9;
  let endTime = 17; // 5 PM

  // Function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12HourFormat = (hour, minute) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    let hour12 = hour % 12;
    if (hour12 === 0) hour12 = 12; // Adjust 0 to 12 for 12:00 PM
    const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`; // Ensure hour is 2 digits
    const minuteStr = minute < 10 ? `0${minute}` : `${minute}`; // Ensure minute is 2 digits
    return `${hourStr}:${minuteStr} ${suffix}`;
  };

  while (startTime < endTime) {
    timeSlots.push(convertTo12HourFormat(startTime, 0)); // e.g., 9:00 AM
    timeSlots.push(convertTo12HourFormat(startTime, 30)); // e.g., 9:30 AM
    startTime++;
  }

  // Handle day selection (toggle availability)
  const handleDayClick = (day) => {
    const newAvailability = [...formData.availability];

    // Check if day is already selected
    const dayIndex = newAvailability.findIndex((item) => item.day === day);
    if (dayIndex >= 0) {
      // If day is already selected, remove it
      newAvailability.splice(dayIndex, 1);
    } else {
      // If day is not selected, add it with empty slots
      newAvailability.push({ day, slots: [] });
    }

    // Update formData with new availability (just the days selected)
    handleChange({ target: { name: "availability", value: newAvailability } });
  };

  // Handle slot selection for a given day
  const handleSlotClick = (slot) => {
    // If no day is selected, prevent slot selection
    if (formData.availability.length === 0) return;

    const newAvailability = formData.availability.map((item) => {
      // For each selected day, toggle the slot
      if (item.slots && item.slots.includes(slot)) {
        // Remove slot if already selected
        item.slots = item.slots.filter((s) => s !== slot);
      } else {
        // Add slot if not selected
        if (!item.slots) item.slots = [];
        item.slots.push(slot);
      }
      return item;
    });

    // Update formData with the updated availability (days and slots)
    handleChange({ target: { name: "availability", value: newAvailability } });
  };

  // Check if any days are selected
  const areDaysSelected = formData.availability.length > 0;

  return (
    <div className="space-y-8">
      {/* Available Days Section */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">
          Available Days
        </label>
        <div className="flex flex-wrap gap-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                formData.availability.some((item) => item.day === day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              } transition-all duration-200`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots Section */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">
          Select Time Slots
        </label>
        <div className="grid grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => handleSlotClick(slot)}
              disabled={!areDaysSelected} // Disable slots if no days are selected
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                formData.availability.some(
                  (item) => item.slots && item.slots.includes(slot)
                )
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              } ${!areDaysSelected ? "opacity-50 cursor-not-allowed" : ""}`} // Style for disabled state
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Fee Section */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">
          Consultation Fee (₹)
        </label>
        <input
          type="number"
          name="consultationFee"
          value={formData.consultationFee}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter consultation fee"
        />
      </div>
    </div>
  );
};

export default Step3;
