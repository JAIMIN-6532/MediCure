import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Video, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../reduxToolkit/reducers/DoctorReducer";
import { Link, useNavigate } from "react-router-dom";
import Filter from "./Filter";
import { ClipLoader } from "react-spinners";

function DoctorsCardsDpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, fetchDoctorsStatus, error } = useSelector(
    (state) => state.doctors
  );

  const { token } = useSelector((state) => state.auth);

  const [doctorId, setDoctorId] = useState(null);

  const [filters, setFilters] = useState({
    location: "",
    gender: "",
    specialty: "",
    consultationType: "",
    minFee: "",
    maxFee: "",
    minRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  useEffect(() => {
    if (fetchDoctorsStatus === "idle") {
      dispatch(fetchDoctors());
    }
  }, [dispatch, fetchDoctorsStatus]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      location: "",
      gender: "",
      specialty: "",
      consultationType: "",
      minFee: "",
      maxFee: "",
      minRating: 0,
    });
  };

  const calculateAverageRating = (feedbacks) => {
    if (feedbacks && feedbacks.length > 0) {
      const totalRating = feedbacks.reduce(
        (sum, feedback) => sum + feedback.rating,
        0
      );
      return totalRating / feedbacks.length;
    }
    return 0;
  };

  const handleBookAppointment = (doctorId) => {
    if (!token) {
      localStorage.setItem("redirect", `/bookappointment/${doctorId}`);
      navigate("/signin");
    } else {
      navigate(`/bookappointment/${doctorId}`);
    }
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
      {serviceType?.includes("Online") && (
        <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <Video className="w-4 h-4 mr-1" />
          Online
        </span>
      )}
      {serviceType?.includes("Offline") && (
        <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          In-person
        </span>
      )}
      {serviceType?.includes("Both") && (
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

  const applyFilters = (doctor) => {
    const matchesGender = filters.gender
      ? doctor.gender?.toLowerCase() === filters.gender.toLowerCase()
      : true;
    const matchesSpecialty = filters.specialty
      ? doctor.specialization === filters.specialty
      : true;
    const matchesLocation = filters.location
      ? doctor.city
          ?.toLowerCase()
          .includes(filters.location?.toLowerCase().trim()) ||
        doctor.clinicaddress
          ?.toLowerCase()
          .includes(filters.location?.toLowerCase().trim()) ||
        doctor.state
          ?.toLowerCase()
          .includes(filters.location?.toLowerCase().trim())
      : true;

    const matchesConsultationType = filters.consultationType
      ? doctor?.serviceType === "Both" ||
        doctor?.serviceType?.includes(filters.consultationType)
      : true;

    const matchesMinFee = filters.minFee
      ? doctor.consultationFee >= filters.minFee
      : true;
    const matchesMaxFee = filters.maxFee
      ? doctor.consultationFee <= filters.maxFee
      : true;
    const matchesMinRating = doctor.feedbacks
      ? calculateAverageRating(doctor.feedbacks) >= filters.minRating
      : true;

    return (
      matchesGender &&
      matchesSpecialty &&
      matchesConsultationType &&
      matchesMinFee &&
      matchesMaxFee &&
      matchesMinRating &&
      matchesLocation
    );
  };

  const filteredDoctors = doctors.filter(applyFilters);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (fetchDoctorsStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color="#36d7b7" />
      </div>
    );
  }

  if (fetchDoctorsStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container w-[90%] mx-auto px-4 py-8 pt-[90px]">
      <div className="flex gap-8">
        <Filter
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
        <div className="w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors
              .slice(
                (currentPage - 1) * doctorsPerPage,
                currentPage * doctorsPerPage
              )
              .map((doctor) => {
                const averageRating = calculateAverageRating(doctor.feedbacks);
                return (
                  <div
                    key={doctor._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                  >
                    <div className="flex p-6">
                      <Link to={`/doctorprofilepatientview/${doctor._id}`}>
                        <div className="w-36 h-36 rounded-lg overflow-hidden">
                          <img
                            src={doctor.profileImageUrl}
                            alt={doctor.name}
                            className="w-36 h-36 rounded-lg object-cover transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                          />
                        </div>
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
                            {doctor.city}
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
                          <p className="text-lg font-semibold ">
                            ₹ {doctor.consultationFee}
                          </p>
                        </div>
                        <ServiceTypeBadge serviceType={doctor.serviceType} />
                      </div>
                      <div className="flex space-x-4 mt-[15px]">
                        <button
                          className="flex-1 bg-light-blue text-primary-blue px-4 py-2 rounded-full hover:bg-primary-blue hover:text-white transition-colors"
                          onClick={() =>
                            navigate(`/doctorprofilepatientview/${doctor._id}`)
                          }
                        >
                          View Profile
                        </button>
                        <button
                          className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-full hover:bg-dark-blue transition-colors"
                          onClick={() => handleBookAppointment(doctor._id)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorsCardsDpage;
