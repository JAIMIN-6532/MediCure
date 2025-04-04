import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { doctorSignIn } from "../../reduxToolkit/reducers/AuthReducer.js";
import AuthLayout from "../AuthLayout.jsx";

const DsignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, token } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(doctorSignIn(formData));
  };

  useEffect(() => {
    const savedToken = token;
    const doctorId = user?._id;
    // console.log(doctorId);
    if (savedToken) {
      navigate(`/d-dashbord/${doctorId}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (user && token) {
      const doctorId = user._id;
      localStorage.setItem("token", token);
      // console.log(doctorId);
      navigate(`/d-dashbord/${doctorId}`);
    }
  }, [user, token, navigate]);

  return (
    <AuthLayout title="Doctor Sign In">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <span>Sign In</span>
          )}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/dsignup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>

        <div className="mt-4 text-sm text-gray-600">
          <span>Not a doctor? </span>
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in as Patient
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default DsignIn;
