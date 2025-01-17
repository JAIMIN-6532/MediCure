import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Video, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../reduxToolkit/reducers/DoctorReducer";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Filter from "./Filter";

function DoctorsCardsDpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { doctors, fetchDoctorsStatus, error } = useSelector((state) => state.doctors);

  const [filters, setFilters] = useState({
    gender: "",
    specialty: "",
    consultationType: "",
    minFee: "",
    maxFee: "",
    minRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  useEffect(() => {
    console.log("In useEffect");
    if (fetchDoctorsStatus === "idle") {
      dispatch(fetchDoctors());
    }
  }, [dispatch, fetchDoctorsStatus]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handleDoctorClick = (doctorId) => {
    console.log("In handleDocclick Doctor ID:", doctorId);
    // Navigate to the profile page of the selected doctor
    // <Link to={`/doctorprofilepatientview/${doctorId}`} />;
  };

  const calculateAverageRating = (feedbacks) => {
    if (feedbacks && feedbacks.length > 0) {
      const totalRating = feedbacks.reduce(
        (sum, feedback) => sum + feedback.rating,
        0
      );
      return totalRating / feedbacks.length;
    }
    return 0; // Return 0 if no feedbacks
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const ServiceTypeBadge = ({ serviceType }) => (
    <div className="flex gap-2">
      {serviceType.includes("Online") && (
        <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <Video className="w-4 h-4 mr-1" />
          Online
        </span>
      )}
      {serviceType.includes("Offline") && (
        <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          In-person
        </span>
      )}
      {serviceType.includes("Both") && (
        <>
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <Video className="w-4 h-4 mr-1" />
            Online
          </span>
          <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            In-person
          </span>
        </>
      )}
    </div>
  );

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-[90px]">
      {/* Filters */}
      <div className="flex gap-8">
        <Filter filters={filters} onFilterChange={handleFilterChange} />

        {/* Doctors Cards */}
        <div className="w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors
              .slice(
                (currentPage - 1) * doctorsPerPage,
                currentPage * doctorsPerPage
              )
              .map((doctor) => {
                const averageRating = calculateAverageRating(doctor.feedbacks);
                // console.log('did',doctor._id);
                return (

                  <div
                    key={doctor._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    // onClick={() => handleDoctorClick(doctor._id)} // Add the onClick handler
                  >
                    <div className="flex p-6">
                      <Link to={`/doctorprofilepatientview/${doctor._id}`}>
                      <img
                        src={doctor.profileImageUrl}
                        alt={doctor.name}
                        className="w-36 h-36 rounded-lg object-cover"
                      />
                      </Link>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialization}</p>
                        <div className="flex items-center mt-2">
                          {renderStars(averageRating)}
                          <span className="ml-2 text-gray-600">
                            ({averageRating.toFixed(1)})
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {doctor.clinicaddress}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1 " />
                            {doctor.experience}+ years
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="text-gray-600">Consultation Fee</p>
                          <p className="text-lg font-semibold">
                            ${doctor.consultationFee}
                          </p>
                        </div>
                        <ServiceTypeBadge serviceType={doctor.serviceType} />
                      </div>
                      <div className="flex space-x-4 mt-[15px]">
                        <button className="flex-1 bg-light-blue text-primary-blue px-4 py-2 rounded-full hover:bg-primary-blue hover:text-white transition-colors" onClick={() => navigate(`/doctorprofilepatientview/${doctor._id}`)}>
                          View Profile
                        </button>
                        <button className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-full hover:bg-dark-blue transition-colors">
                          Book Now
                        </button>
                        
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorsCardsDpage;
