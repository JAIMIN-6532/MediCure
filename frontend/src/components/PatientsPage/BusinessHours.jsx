import React from 'react';

const BusinessHours = ({ businessHours }) => {
  const calculateSlots = (startTime, endTime) => {
    let start = parseInt(startTime.split(":")[0], 10);
    let end = parseInt(endTime.split(":")[0], 10);
    
    let slotsCount = 0;
    while (start < end) {
      slotsCount += 2;  // Two half-hour slots per hour
      start += 1;
    }
    return slotsCount;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h2>
      <div className="space-y-4">
        {businessHours?.map(({ day }) => {
          // Assuming business hours from 9 AM to 5 PM
          const slotsCount = calculateSlots("09:00", "17:00");

          return (
            <div key={day} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <span className="font-semibold text-gray-800">{day}</span>
              <span className="text-gray-600">
                {slotsCount > 0 ? (
                  <div className="text-green-600 text-sm">9:00 AM - 5:00 PM</div>
                ) : (
                  'Closed'
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHours;
