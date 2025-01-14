// GenderSelection.js
import React from 'react';

const GenderSelection = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {['male', 'female', 'other'].map((gender) => (
        <button
          key={gender}
          type="button"
          onClick={() => handleChange({ target: { name: 'gender', value: gender } })}
          className={`p-4 border rounded-lg flex flex-col items-center ${
            formData.gender === gender
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <span className="h-8 w-8 mb-2">{gender.charAt(0).toUpperCase()}</span>
          <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
        </button>
      ))}
    </div>
  );
};

export default GenderSelection;
