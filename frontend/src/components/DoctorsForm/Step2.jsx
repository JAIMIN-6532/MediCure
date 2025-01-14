// Step2.js
import React from "react";
import GenderSelection from "./GenderSelection";

const Step2 = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <GenderSelection formData={formData} handleChange={handleChange} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type
        </label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select service type</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Both">Both</option>
        </select>
      </div>

      {(formData.serviceType === "Offline" ||
        formData.serviceType === "Both") && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Address
            </label>
            <textarea
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default Step2;
