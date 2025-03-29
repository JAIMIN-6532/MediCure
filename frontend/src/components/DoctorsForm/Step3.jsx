import React from "react";
const Step3 = ({ formData, handleChange }) => {
  // days of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // generate 30-minute interval time slots from 9:00 AM to 5:00 PM
  const timeSlots = [];
  let startTime = 9;
  let endTime = 17; // 5 PM

  // function to convert 24-hour time to 12-hour format with AM/PM to display properly..
  const convertTo12HourFormat = (hour, minute) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    let hour12 = hour % 12;
    if (hour12 === 0) hour12 = 12; // adjust 0 to 12 for 12:00 PM
    const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`; // ensure hour is 2 digits
    const minuteStr = minute < 10 ? `0${minute}` : `${minute}`; // ensure minute is 2 digits
    return `${hourStr}:${minuteStr} ${suffix}`;
  };

  while (startTime < endTime) {
    timeSlots.push(convertTo12HourFormat(startTime, 0));
    timeSlots.push(convertTo12HourFormat(startTime, 30));
    startTime++;
  }

  const handleDayClick = (day) => {
    const newAvailability = [...formData.availability];

    const dayIndex = newAvailability.findIndex((item) => item.day === day);
    if (dayIndex >= 0) {
      newAvailability.splice(dayIndex, 1);
    } else {
      newAvailability.push({ day, slots: [] });
    }

    handleChange({ target: { name: "availability", value: newAvailability } });
  };

  const handleSlotClick = (slot) => {
    if (formData.availability.length === 0) return;

    const newAvailability = formData.availability.map((item) => {
      if (item.slots && item.slots.includes(slot)) {
        item.slots = item.slots.filter((s) => s !== slot);
      } else {
        if (!item.slots) item.slots = [];
        item.slots.push(slot);
      }
      return item;
    });

    handleChange({ target: { name: "availability", value: newAvailability } });
  };

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
              disabled={!areDaysSelected} // disable slots if no days are selected
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                formData.availability.some(
                  (item) => item.slots && item.slots.includes(slot)
                )
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              } ${!areDaysSelected ? "opacity-50 cursor-not-allowed" : ""}`}
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
