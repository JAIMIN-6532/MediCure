import { format, addDays, subDays } from "date-fns";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function SlotSelection({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  doctor,
  appointmentSlots,
  setSelectedSlot,
  onNext,
}) {
  console.log("appointmentSlots: ", appointmentSlots);

  // Ensure appointmentSlots is not undefined or null before accessing it
  if (!appointmentSlots) {
    console.error("appointmentSlots is undefined or null");
    return <div>Error: No available appointment slots.</div>;
  }

  // Function to categorize slots into morning, afternoon, and evening
  const categorizeSlots = (availableSlots) => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    // Get the current time in IST (Indian Standard Time)
    const today = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // Set the time zone to IST
    };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedCurrentTime = formatter.format(today);
    const [currentHour, currentMinutePeriod] = formattedCurrentTime.split(":");
    const [currentMinute, period] = currentMinutePeriod.split(" ");
    let currentHour24 = parseInt(currentHour);
    if (period === "PM" && currentHour !== "12") {
      currentHour24 += 12;
    }
    if (period === "AM" && currentHour === "12") {
      currentHour24 = 0; // Midnight edge case
    }
    const currentTimeInMinutes = currentHour24 * 60 + parseInt(currentMinute); // Convert current time to minutes

    // Sort slots into respective periods based on time
    // availableSlots.forEach((slot) => {
    //   // const hour = parseInt(slot.split(":")[0]);
    //   const [hour, minute] = slot.split(":");
    //   const period = slot.split(" ")[1]; // AM or PM

    //   // Convert to 24-hour format for comparison
    //   let hour24 = parseInt(hour);
    //   if (period === "PM" && hour !== 12) {
    //     hour24 += 12;
    //   }
    //   if (period === "AM" && hour === 12) {
    //     hour24 = 0; // Midnight edge case
    //   }
    //   // Get current date and time in IST using `Intl.DateTimeFormat`
    //   const today = new Date();

    //   // Format the time in IST (Indian Standard Time)
    //   const options = {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     hour12: true,
    //     timeZone: "Asia/Kolkata", // Set the time zone to IST
    //   };

    //   const formatter = new Intl.DateTimeFormat("en-US", options);
    //   console.log(formatter.format(today)); // Output: 12:00 AM

    //   const formattedTime = formatTime(hour24, minute, period);

    //   if (hour24 >= 9 && hour24 < 12)
    //     morning.push(formattedTime); // Morning: 9:00 AM - 11:59 AM
    //   else if (hour24 >= 12 && hour24 < 17)
    //     afternoon.push(formattedTime); // Afternoon: 12:00 PM - 4:59 PM
    //   else if (hour24 >= 17 && hour24 < 20) evening.push(formattedTime); // Evening: 5:00 PM - 7:59 PM
    // });
    // Sort slots into respective periods based on time
    availableSlots.forEach((slot) => {
      // Extract hour and minute from the slot time (e.g. "09:30 AM")
      const [time, period] = slot.split(" ");
      const [hour, minute] = time.split(":");

      // Convert the slot time to 24-hour format
      let hour24 = parseInt(hour);
      if (period === "PM" && hour !== "12") {
        hour24 += 12;
      }
      if (period === "AM" && hour === "12") {
        hour24 = 0; // Midnight edge case
      }
      const slotTimeInMinutes = hour24 * 60 + parseInt(minute); // Convert slot time to minutes

      // Check if the selected date is today or a future date
      const isToday =
        format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

      // If it's today, we need to exclude past slots
      if (isToday && slotTimeInMinutes <= currentTimeInMinutes) {
        return; // Skip this slot as it's in the past
      }

      const formattedTime = formatTime(hour24, minute, period);

      if (hour24 >= 9 && hour24 < 12)
        morning.push(formattedTime); // Morning: 9:00 AM - 11:59 AM
      else if (hour24 >= 12 && hour24 < 17)
        afternoon.push(formattedTime); // Afternoon: 12:00 PM - 4:59 PM
      else if (hour24 >= 17 && hour24 < 20) evening.push(formattedTime); // Evening: 5:00 PM - 7:59 PM
    });

    // Sort the slots in each period
    return {
      morning: morning.sort((a, b) => a.localeCompare(b)),
      afternoon: afternoon.sort((a, b) => a.localeCompare(b)),
      evening: evening.sort((a, b) => a.localeCompare(b)),
    };
  };

  // Helper function to format time in the 12-hour AM/PM format with leading zeros
  const formatTime = (hour24, minute, period) => {
    // Convert back to 12-hour format
    let hour = hour24;
    let ampm = period;

    if (hour24 === 0) {
      hour = 12; // Midnight hour
      ampm = "AM";
    } else if (hour24 > 12) {
      hour = hour24 - 12;
      ampm = "PM";
    } else if (hour24 === 12) {
      ampm = "PM"; // Noon hour
    } else {
      ampm = "AM";
    }

    // Pad the hour and minute to ensure it's in `hh:mm AM/PM` format
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute.length === 1 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Find available slots for the selected date from appointmentSlots
  const availableSlotsForSelectedDate = appointmentSlots.find(
    (slot) =>
      format(new Date(slot.date), "yyyy-MM-dd") ===
      format(selectedDate, "yyyy-MM-dd")
  );

  // If there are no slots available for the selected date, default to empty arrays
  const categorizedSlots = availableSlotsForSelectedDate
    ? categorizeSlots(availableSlotsForSelectedDate.availableSlots)
    : { morning: [], afternoon: [], evening: [] };

  // Check if slots are available for the selected date
  const noSlotsAvailableForDate = !availableSlotsForSelectedDate;

  // const today = new Date();
  // const istDate = new Date(today.getTime() + (5 * 60 + 30) * 60 * 1000); // Convert to IST
  // istDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
  // console.log("IST Date: ", istDate);
  // const todayTime = istDate.getTime();
  // console.log("Today Time: ", todayTime);

  const handlePrevDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FaCalendarAlt className="text-primary" />
        Select Available Slots
      </h2>

      {/* Date Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Choose Date</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {[...Array(7)].map((_, i) => {
            const date = addDays(new Date(), i);
            const isSelected =
              selectedDate.toDateString() === date.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex-shrink-0 w-24 p-4 rounded-xl transition-all transform hover:scale-100
                  ${
                    isSelected
                      ? "bg-primary text-white shadow-lg scale-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                `}
              >
                <p
                  className={`font-semibold ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {format(date, "EEE")}
                </p>
                <p
                  className={`text-2xl font-bold my-1 ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {format(date, "d")}
                </p>
                <p
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {format(date, "MMM")}
                </p>
                {isToday && !isSelected && (
                  <p className="text-xs text-primary font-semibold mt-1">
                    Today
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FaClock className="text-primary text-xl" />
          <h3 className="text-lg font-semibold text-gray-700">
            Available Slots
          </h3>
        </div>

        {/* Show "Not Available" if no slots for selected date */}
        {noSlotsAvailableForDate && (
          <div className="text-center text-gray-500 mb-6">Not Available</div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Morning Slots */}
          <div className="flex-1 bg-gray-50 p-4 rounded-xl">
            <h4 className="text-primary font-semibold mb-4 capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Morning
            </h4>
            <div className="space-y-3">
              {categorizedSlots.morning.length === 0 ? (
                <p className="text-center text-gray-500">No slots available</p>
              ) : (
                categorizedSlots.morning.map((time,index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(time)}
                    className={`
                      w-full p-3 rounded-lg transition-all transform hover:scale-105
                      ${
                        selectedSlot === time
                          ? "bg-primary text-white shadow-md scale-105"
                          : "bg-white hover:bg-gray-100 hover:shadow-sm"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="flex-1 bg-gray-50 p-4 rounded-xl">
            <h4 className="text-primary font-semibold mb-4 capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Afternoon
            </h4>
            <div className="space-y-3">
              {categorizedSlots.afternoon.length === 0 ? (
                <p className="text-center text-gray-500">No slots available</p>
              ) : (
                categorizedSlots.afternoon.map((time,index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(time)}
                    className={`
                      w-full p-3 rounded-lg transition-all transform hover:scale-105
                      ${
                        selectedSlot === time
                          ? "bg-primary text-white shadow-md scale-105"
                          : "bg-white hover:bg-gray-100 hover:shadow-sm"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Evening Slots */}
          <div className="flex-1 bg-gray-50 p-4 rounded-xl">
            <h4 className="text-primary font-semibold mb-4 capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Evening
            </h4>
            <div className="space-y-3">
              {categorizedSlots.evening.length === 0 ? (
                <p className="text-center text-gray-500">No slots available</p>
              ) : (
                categorizedSlots.evening.map((time,index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(time)}
                    className={`
                      w-full p-3 rounded-lg transition-all transform hover:scale-105
                      ${
                        selectedSlot === time
                          ? "bg-primary text-white shadow-md scale-105"
                          : "bg-white hover:bg-gray-100 hover:shadow-sm"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!selectedSlot}
        className={`
          mt-8 w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all transform
          ${
            selectedSlot
              ? "bg-primary text-white hover:bg-blue-600 hover:scale-105 shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Continue Booking
      </button>
    </div>
  );
}
