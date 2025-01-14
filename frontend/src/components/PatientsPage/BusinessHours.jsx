import React from 'react';

const BusinessHours = ({ businessHours }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h2>
      <div className="space-y-4">
        {businessHours?.map(({ day, slots }) => (
          <div key={day} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
            <span className="font-semibold text-gray-800">{day}</span>
            <span className="text-gray-600">
              {slots.length > 0 ? slots.join(', ') : 'Closed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
