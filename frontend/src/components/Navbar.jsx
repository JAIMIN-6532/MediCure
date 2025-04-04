import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reduxToolkit/reducers/AuthReducer";
import { Stethoscope } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);
  // const isdid = localStorage.getItem("did");
  const [userType, setUserType] = useState(null);

  const isLoggedIn = !!token;

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Replace URL-safe characters
      const decodedPayload = JSON.parse(atob(base64)); // Decode and parse the payload
      return decodedPayload.userType; // Return userType from the decoded payload
    } catch (error) {
      // console.error("Token decode error", error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const type = decodeToken(token);
      setUserType(type);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (localStorage.getItem("doctor")) {
      localStorage.removeItem("doctor");
    }
    if (localStorage.getItem("did")) {
      localStorage.removeItem("did");
    }
    if (localStorage.getItem("pid")) {
      localStorage.removeItem("pid");
    }
    localStorage.removeItem("user");
    dispatch(logout());
    
    setIsOpen(false)
    window.location.href = "/";
  };

  const handleProfileClick = () => {
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
          {userType !== "doctor" && (
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className="hover:text-primary-blue transition-colors"
              >
                Home
              </NavLink>
              <NavLink
                to="/doctors"
                className="hover:text-primary-blue transition-colors"
              >
                Doctors
              </NavLink>
              <NavLink
                to="/about"
                className="hover:text-primary-blue transition-colors"
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className="hover:text-primary-blue transition-colors"
              >
                Contact
              </NavLink>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && (user) ? (
              <div className="flex items-center space-x-2">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                    onClick={handleProfileClick}
                  />
                ) : (
                  <span
                    onClick={handleProfileClick}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-blue text-white font-bold cursor-pointer"
                  >
                    {user.name.slice(0, 2).toUpperCase() || "User"}
                  </span>
                )}
              </div>
            ) : null}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/signin"
                className="hover:text-primary-blue transition-colors"
              >
                <button className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors">
                  Login/Register
                </button>
              </NavLink>
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
            <NavLink
              to="/"
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/doctors"
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              Doctors
            </NavLink>
            <NavLink
              to="/about"
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>

            <div className="text-center">
            {isLoggedIn && (user) ? (
              <div className="flex items-center space-x-2">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover cursor-pointer"
                    onClick={handleProfileClick}
                  />
                ) : (
                  <span
                    onClick={handleProfileClick}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-blue text-white font-bold cursor-pointer"
                  >
                    {user.name.slice(0, 2).toUpperCase() || "User"}
                  </span>
                )}
              </div>
            ) : null}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/signin"
                  className="hover:text-primary-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors">
                    Login/Register
                  </button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
