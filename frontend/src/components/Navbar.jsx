// // import React from "react";
// // import { NavLink } from "react-router-dom";

// // const Navbar = () => {
// //   return (
// //     <nav className="fixed top-0 left-0 right-0 z-50 flex flex-wrap justify-between items-center p-4 text-black w-full h-[70px] bg-[#e8f6ff]">
// //       {/* Left Side Logo */}
// //       <div className="flex items-center w-full md:w-auto">
// //         <h1 className="text-3xl text-blue-900 font-bold">MEDICURE</h1>
// //       </div>

// //       {/* Middle NavLinks */}
// //       <div className="flex flex-wrap space-x-8 w-full md:w-auto justify-center md:justify-start mt-4 md:mt-0">
// //         <NavLink to="/" className="text-lg hover:text-blue-400 transition-all">
// //           Home
// //         </NavLink>
// //         <NavLink
// //           to="/doctors"
// //           className="text-lg hover:text-blue-400 transition-all"
// //         >
// //           Doctors
// //         </NavLink>
// //         <NavLink
// //           to="/about"
// //           className="text-lg hover:text-blue-400 transition-all"
// //         >
// //           About Us
// //         </NavLink>
// //         <NavLink
// //           to="/contact"
// //           className="text-lg hover:text-blue-400 transition-all"
// //         >
// //           Contact
// //         </NavLink>
// //       </div>

// //       {/* Right Side Login/Register Button */}
// //       <div>
// //         <button className="bg-[#0e82fd] text-white border-2 border-[#0e82fd] py-2 px-6 rounded-lg hover:bg-white hover:text-[#0e82fd] transition-all">
// //           Login/Register
// //         </button>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaBars, FaTimes } from 'react-icons/fa';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const navLinkStyles = ({ isActive }) => ({
//     color: isActive ? '#0e82fd' : '#002578',
//   });

//   return (
//     <nav className="fixed w-full bg-light-blue shadow-md z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex-shrink-0">
//             <NavLink to="/" className="text-2xl font-bold text-primary-blue">
//               MEDICURE
//             </NavLink>
//           </div>

//           <div className="hidden md:flex items-center space-x-8">
//             <NavLink to="/" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
//               Home
//             </NavLink>
//             <NavLink to="/doctors" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
//               Doctors
//             </NavLink>
//             <NavLink to="/about" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
//               About Us
//             </NavLink>
//             <NavLink to="/contact" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
//               Contact
//             </NavLink>
//           </div>

//           <div className="hidden md:flex items-center">
//             <button className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors" onClick={()=>{window.location.href="/signin"}}>
//               Login/Register
//             </button>
//           </div>

//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-dark-blue hover:text-primary-blue"
//             >
//               {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 bg-light-blue">
//             <NavLink
//               to="/"
//               style={navLinkStyles}
//               className="block px-3 py-2 hover:text-primary-blue"
//               onClick={() => setIsOpen(false)}
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/doctors"
//               style={navLinkStyles}
//               className="block px-3 py-2 hover:text-primary-blue"
//               onClick={() => setIsOpen(false)}
//             >
//               Doctors
//             </NavLink>
//             <NavLink
//               to="/about"
//               style={navLinkStyles}
//               className="block px-3 py-2 hover:text-primary-blue"
//               onClick={() => setIsOpen(false)}
//             >
//               About Us
//             </NavLink>
//             <NavLink
//               to="/contact"
//               style={navLinkStyles}
//               className="block px-3 py-2 hover:text-primary-blue"
//               onClick={() => setIsOpen(false)}
//             >
//               Contact
//             </NavLink>
//             <button className="w-full text-center bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors">
//               Login/Register
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reduxToolkit/reducers/AuthReducer"; // import the logout action
import { Stethoscope } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // Get user and token from Redux state
  const { user, token } = useSelector((state) => state.auth);
  const isdid = localStorage.getItem("did");
  const [userType, setUserType] = useState(null); // state to store userType from token

  // Check if user is logged in by verifying if token exists in Redux state
  const isLoggedIn = !!token;

  // Function to decode JWT token and extract the userType
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
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

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    //if localstorage have did then remove it
    if (localStorage.getItem("did")) {
      localStorage.removeItem("did");
    }
    localStorage.removeItem("user"); // Remove user from localStorage
    dispatch(logout()); // Dispatch logout action to reset state in Redux
    window.location.href = "/"; // Redirect to the home page
  };

  // Handle profile click for both image and initials
  const handleProfileClick = () => 
    {
      const userId = user._id;
    if (userType === "doctor") {
      window.location.href = `/d-dashbord/${userId}`;
    } else if (userType === "patient") {
      window.location.href = `/p-dashbord/${userId}`;
    }
  };

  return (
    <nav className="fixed w-full bg-light-blue shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 ">
            <NavLink to="/" className="text-2xl font-bold text-primary-blue">
              <Stethoscope className="w-8 h-7 text-blue-600 inline " /> MEDICURE
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className="hover:text-primary-blue transition-colors">
              Home
            </NavLink>
            <NavLink to="/doctors" className="hover:text-primary-blue transition-colors">
              Doctors
            </NavLink>
            <NavLink to="/about" className="hover:text-primary-blue transition-colors">
              About Us
            </NavLink>
            <NavLink to="/contact" className="hover:text-primary-blue transition-colors">
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-2">
                {/* Display user's profile image if available */}
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                    onClick={handleProfileClick} // Click on image to navigate
                  />
                ) : (
                  // Fallback to initials if no profile image
                  <span
                    onClick={handleProfileClick} // Handle the click on the circular shape
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-blue text-white font-bold cursor-pointer"
                  >
                    {user.name.slice(0, 2).toUpperCase() || "User"}
                  </span>
                )}
              </div>
            ) : null}

            {isLoggedIn || isdid ? (
              <button
                onClick={handleLogout}
                className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => (window.location.href = "/signin")}
                className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors"
              >
                Login/Register
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark-blue hover:text-primary-blue"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-light-blue">
            <NavLink to="/" className="block px-3 py-2 hover:text-primary-blue" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/doctors" className="block px-3 py-2 hover:text-primary-blue" onClick={() => setIsOpen(false)}>
              Doctors
            </NavLink>
            <NavLink to="/about" className="block px-3 py-2 hover:text-primary-blue" onClick={() => setIsOpen(false)}>
              About Us
            </NavLink>
            <NavLink to="/contact" className="block px-3 py-2 hover:text-primary-blue" onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>

            <div className="text-center">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => (window.location.href = "/signin")}
                  className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors"
                >
                  Login/Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

