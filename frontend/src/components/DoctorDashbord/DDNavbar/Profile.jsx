import { useEffect } from "react";
import gsap from "gsap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchDoctorAvgRatingByDoctorId, fetchDoctorById } from "../../../reduxToolkit/reducers/DoctorReducer";


export default function Profile() {
  const dispatch = useDispatch();
  const { doctorId } = useParams(); 

  const doctor = useSelector((state) => state.doctors.selectedDoctor);
  const avgRating = useSelector((state) => state.doctors.avgRating);
  const fetchAvgRatingStatus = useSelector((state) => state.doctors.fetchDoctorAvgRatingStatus);
  const fetchDoctorStatus = useSelector((state) => state.doctors.fetchDoctorStatus);

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorById(doctorId)); 
      dispatch(fetchDoctorAvgRatingByDoctorId(doctorId)); 
    }
  }, [doctorId, dispatch]);

  const displayAvgRating = () => {
    if (fetchAvgRatingStatus === "loading") {
      return (
        <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm">
          Loading Rating...
        </span>
      );
    }

    if (avgRating) {
      return (
        <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm">
          ⭐ {avgRating.toFixed(2)} / 5
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm">
        ⭐ Not Rated Yet
      </span>
    );
  };

  useEffect(() => {
    gsap.fromTo(
      ".profile-image",
      { scale: 1 },
      { scale: 1.05, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  const handleImageHover = () => {
    gsap.to(".profile-image", {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleImageLeave = () => {
    gsap.to(".profile-image", { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  if (fetchDoctorStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-primary text-xl font-semibold">Loading Doctor Info...</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-red-600 text-xl font-semibold">Doctor Not Found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div
        className="relative profile-image"
        onMouseEnter={handleImageHover}
        onMouseLeave={handleImageLeave}
      >
        <img
          src={doctor?.profileImageUrl}
          alt="Doctor"
          className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
        />
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      <h2 className="mt-4 text-xl font-semibold">{doctor?.name}</h2>
      <p className="text-sm text-gray-500">{doctor?.specialization}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm">
          {displayAvgRating()}
        </span>
        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
          Available
        </span>
      </div>
    </div>
  );
}
