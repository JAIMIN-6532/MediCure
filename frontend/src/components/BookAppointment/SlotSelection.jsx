import { format, addDays, subDays } from 'date-fns';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

export default function SlotSelection({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  appointmentSlots,
  setSelectedSlot,
  onNext
}) {

  // Ensure appointmentSlots is not undefined or null before accessing it
  if (!appointmentSlots) {
    console.error('appointmentSlots is undefined or null');
    return <div>Error: No available appointment slots.</div>;
  }

  // Function to categorize slots into morning, afternoon, and evening
  const categorizeSlots = (availableSlots) => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    // Sort slots into respective periods based on time
    availableSlots.forEach((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      const period = slot.split(" ")[1]; // AM or PM

      // Convert to 24-hour format for comparison
      let hour24 = hour;
      if (period === "PM" && hour !== 12) {
        hour24 += 12;
      }
      if (period === "AM" && hour === 12) {
        hour24 = 0; // Midnight edge case
      }

      if (hour24 >= 9 && hour24 < 12) morning.push(slot);      // Morning: 9:00 AM - 11:59 AM
      else if (hour24 >= 12 && hour24 < 17) afternoon.push(slot); // Afternoon: 12:00 PM - 4:59 PM
      else if (hour24 >= 17 && hour24 < 20) evening.push(slot);   // Evening: 5:00 PM - 7:59 PM
    });

    return { morning, afternoon, evening };
  };

  // Find available slots for the selected date from appointmentSlots
  const availableSlotsForSelectedDate = appointmentSlots.find(
    (slot) => format(new Date(slot.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  // If there are no slots available for the selected date, default to empty arrays
  const categorizedSlots = availableSlotsForSelectedDate
    ? categorizeSlots(availableSlotsForSelectedDate.availableSlots)
    : { morning: [], afternoon: [], evening: [] };

  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
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
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex-shrink-0 w-24 p-4 rounded-xl transition-all transform hover:scale-100
                  ${isSelected 
                    ? 'bg-primary text-white shadow-lg scale-100' 
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {format(date, 'EEE')}
                </p>
                <p className={`text-2xl font-bold my-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {format(date, 'd')}
                </p>
                <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {format(date, 'MMM')}
                </p>
                {isToday && !isSelected && (
                  <p className="text-xs text-primary font-semibold mt-1">Today</p>
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
          <h3 className="text-lg font-semibold text-gray-700">Available Slots</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Morning Slots */}
          <div className="flex-1 bg-gray-50 p-4 rounded-xl">
            <h4 className="text-primary font-semibold mb-4 capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Morning
            </h4>
            <div className="space-y-3">
              {categorizedSlots.morning.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedSlot(time)}
                  className={`
                    w-full p-3 rounded-lg transition-all transform hover:scale-105
                    ${selectedSlot === time
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white hover:bg-gray-100 hover:shadow-sm'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="flex-1 bg-gray-50 p-4 rounded-xl">
            <h4 className="text-primary font-semibold mb-4 capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Afternoon
            </h4>
            <div className="space-y-3">
              {categorizedSlots.afternoon.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedSlot(time)}
                  className={`
                    w-full p-3 rounded-lg transition-all transform hover:scale-105
                    ${selectedSlot === time
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white hover:bg-gray-100 hover:shadow-sm'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Evening Slots */}
          <div className="flex-1 bg-gray-50 p-4 rounded-xl">
            <h4 className="text-primary font-semibold mb-4 capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Evening
            </h4>
            <div className="space-y-3">
              {categorizedSlots.evening.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedSlot(time)}
                  className={`
                    w-full p-3 rounded-lg transition-all transform hover:scale-105
                    ${selectedSlot === time
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white hover:bg-gray-100 hover:shadow-sm'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!selectedSlot}
        className={`
          mt-8 w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all transform
          ${selectedSlot 
            ? 'bg-primary text-white hover:bg-blue-600 hover:scale-105 shadow-lg' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Continue Booking
      </button>
    </div>
  );
}
