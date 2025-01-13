// import React from "react";
// import { NavLink } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 flex flex-wrap justify-between items-center p-4 text-black w-full h-[70px] bg-[#e8f6ff]">
//       {/* Left Side Logo */}
//       <div className="flex items-center w-full md:w-auto">
//         <h1 className="text-3xl text-blue-900 font-bold">MEDICURE</h1>
//       </div>

//       {/* Middle NavLinks */}
//       <div className="flex flex-wrap space-x-8 w-full md:w-auto justify-center md:justify-start mt-4 md:mt-0">
//         <NavLink to="/" className="text-lg hover:text-blue-400 transition-all">
//           Home
//         </NavLink>
//         <NavLink
//           to="/doctors"
//           className="text-lg hover:text-blue-400 transition-all"
//         >
//           Doctors
//         </NavLink>
//         <NavLink
//           to="/about"
//           className="text-lg hover:text-blue-400 transition-all"
//         >
//           About Us
//         </NavLink>
//         <NavLink
//           to="/contact"
//           className="text-lg hover:text-blue-400 transition-all"
//         >
//           Contact
//         </NavLink>
//       </div>

//       {/* Right Side Login/Register Button */}
//       <div>
//         <button className="bg-[#0e82fd] text-white border-2 border-[#0e82fd] py-2 px-6 rounded-lg hover:bg-white hover:text-[#0e82fd] transition-all">
//           Login/Register
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#0e82fd' : '#002578',
  });

  return (
    <nav className="fixed w-full bg-light-blue shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-primary-blue">
              MEDICURE
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
              Home
            </NavLink>
            <NavLink to="/doctors" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
              Doctors
            </NavLink>
            <NavLink to="/about" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
              About Us
            </NavLink>
            <NavLink to="/contact" style={navLinkStyles} className="hover:text-primary-blue transition-colors">
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center">
            <button className="bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors">
              Login/Register
            </button>
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
              style={navLinkStyles}
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/doctors"
              style={navLinkStyles}
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              Doctors
            </NavLink>
            <NavLink
              to="/about"
              style={navLinkStyles}
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              style={navLinkStyles}
              className="block px-3 py-2 hover:text-primary-blue"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>
            <button className="w-full text-center bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-dark-blue transition-colors">
              Login/Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;