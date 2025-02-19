import React from "react";
import {
  FaSearch,
  FaUserMd,
  FaCalendarAlt,
  FaRegCommentDots,
} from "react-icons/fa"; // Import React Icons
import { Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";
import { useState } from "react";
import SpecialtyCard from "./SpecialityCard";
import homedoctor from "../../assets/homedoctor.png";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { gsap } from "gsap";
const Home = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Replace URL-safe characters
      const decodedPayload = JSON.parse(atob(base64)); // Decode and parse the payload
      return decodedPayload.userType; // Return userType from the decoded payload
    } catch (error) {
      console.error("Token decode error", error);
      return null;
    }
  };

  // Set userType when token changes
  useEffect(() => {
    if (token) {
      const type = decodeToken(token);
      setUserType(type); // Set userType based on token
    }
  }, [token]); // Run effect when token changes

  // Animation for individual letters of the "Make an Appointment" text
  useEffect(() => {
    const textWrapper = document.querySelector(".appointment-btn");
    const letters = textWrapper?.textContent.split("") || [];

    textWrapper.innerHTML = letters
      .map((letter) => `<span class="letter">${letter}</span>`)
      .join(""); // Wrap each letter with <span>

    // GSAP animation to animate each letter
    gsap.fromTo(
      ".appointment-btn .letter", // Targeting each individual letter inside the span
      {
        opacity: 0,
        y: 20, // Start 20px lower
      },
      {
        opacity: 1,
        y: 0, // Move back to normal position
        duration: 1.1, // Shorter duration for faster animation
        ease: "easeOut",
        stagger: 0.05, // A little stagger to make the animation feel more fluid
        repeat: -1, // Repeat infinitely
        yoyo: true, // Reverse the animation after it completes
      }
    );
  }, []);

  // const handleFindDoctorsClick = () => {
  //   navigate("/doctors");
  // };
  return (
    <>
      {/* Hero Section */}
      <div className="bg-light-blue pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between min-h-[70%] overflow-hidden">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-primary-blue">Search Doctors,</span>
                <br />
                <span className="text-dark-blue appointment-btn">
                  Make an Appointment
                </span>
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg">
                Discover the best doctors, clinics, and hospitals in your area.
                Book appointments instantly and get the care you deserve.
              </p>
              {/* <Link to="/doctors" className="text-primary-blue text-lg font-semibold hover:underline"> */}
              {userType !== "doctor" && (
                <NavLink
                  to="/doctors"
                  className="text-primary-blue text-lg font-semibold hover:underline"
                >
                  <button
                    className="bg-primary-blue text-white px-8 py-3 rounded-full hover:bg-dark-blue transition-colors text-lg"
                    // onClick={handleFindDoctorsClick}
                  >
                    Find Doctors
                  </button>
                </NavLink>
              )}

              {/* </Link> */}
            </div>
            <div className="md:w-1/2">
              <img
                src={homedoctor}
                alt="Doctor"
                className="w-full max-w-lg mx-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="bg-white">
        <SpecialtyCard />
      </div>

      {/* Doctor Cards Section */}
      {/* {userType !== "doctor" && (
        <div className="bg-light-blue">
          <DoctorCard />
        </div>
      )} */}
      {/* New Section: How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side: Image */}
            <div className="md:w-1/2">
              <img
                src={homedoctor} // Replace with your image
                alt="Search Doctor"
                className="w-full max-w-lg mx-auto rounded-lg"
              />
            </div>

            {/* Right Side: Steps */}
            <div className="md:w-1/2 text-left">
              <h1 className="text-4xl mb-[15px] font-bold text-dark-blue">
                How It Works?..
              </h1>
              <h2 className="text-3xl font-semibold text-dark-blue mb-6">
                4 Easy Steps to Get Your Solution
              </h2>
              {/* Steps */}
              <div className="flex flex-wrap gap-8">
                {/* First Row (Two Steps Side by Side) */}
                <div className="flex-1">
                  <div className="flex items-start mb-8">
                    <FaSearch className="text-primary-blue text-6xl mr-4" />
                    <div>
                      <h3 className="font-semibold text-primary-blue text-[1.3rem]">
                        Search Doctor
                      </h3>
                      <p>
                        Search for a doctor based on specialization, location,
                        or availability.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-8">
                    <FaUserMd className="text-primary-blue text-6xl mr-4" />
                    <div>
                      <h3 className="font-semibold text-primary-blue text-[1.3rem]">
                        Check Doctor Profile
                      </h3>
                      <p>
                        Explore detailed doctor profiles on our platform to make
                        informed healthcare decisions.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Second Row (Two Steps Below) */}
                <div className="flex-1">
                  <div className="flex items-start mb-8">
                    <FaCalendarAlt className="text-primary-blue text-6xl mr-4" />
                    <div>
                      <h3 className="font-semibold text-primary-blue text-[1.3rem]">
                        Schedule Appointment
                      </h3>
                      <p>
                        After choosing your preferred doctor, select a
                        convenient time slot, & confirm your appointment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-8">
                    <FaRegCommentDots className="text-primary-blue text-6xl mr-4" />
                    <div>
                      <h3 className="font-semibold text-primary-blue text-[1.3rem]">
                        Get Your Solution
                      </h3>
                      <p>
                        Discuss your health concerns with the doctor and receive
                        personalized advice & solution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
