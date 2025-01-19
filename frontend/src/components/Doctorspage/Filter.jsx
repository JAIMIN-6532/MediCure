import React from "react";

function Filter({ filters, onFilterChange, onResetFilters }) {
  const specialties = ["Cardiologist", "Neurology", "Pediatrics", "Dermatologist", "Orthopedics"];
  const consultationTypes = ["Online", "Offline"];

  return (
    <div className="w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      {/* Location Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Location</h3>
        <input
  type="text"
  placeholder="Search by City"
  className="w-full p-2 border rounded-md"
  value={filters.location || ""} // Ensure location is always a string
  onChange={(e) => onFilterChange("location", e.target.value)} // Handle location change
/>
        
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Gender</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={filters.gender}
          onChange={(e) => onFilterChange("gender", e.target.value)}
        >
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Specialty Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Specialty</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={filters.specialty}
          onChange={(e) => onFilterChange("specialty", e.target.value)}
        >
          <option value="">All</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>

      {/* Consultation Type Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Consultation Type</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={filters.consultationType}
          onChange={(e) => onFilterChange("consultationType", e.target.value)}
        >
          <option value="">All</option>
          {consultationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Fee Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Consultation Fee</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2 border rounded-md"
            value={filters.minFee}
            onChange={(e) => onFilterChange("minFee", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2 border rounded-md"
            value={filters.maxFee}
            onChange={(e) => onFilterChange("maxFee", e.target.value)}
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Minimum Rating</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange("minRating", rating)}
              className={`p-2 ${filters.minRating >= rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17.75l-5.24 3.28 1.49-6.43-4.9-4.24 6.42-.53L12 2l2.23 7.81 6.42.53-4.9 4.24 1.49 6.43z"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
      {/* Reset Button */}
      <button
        onClick={onResetFilters}
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default Filter;
