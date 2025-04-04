import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../AuthLayout.jsx";
import { patientSignIn } from "../../reduxToolkit/reducers/AuthReducer.js";

const SignIn = () => {
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
    dispatch(patientSignIn(formData));
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (user && token) {
      if (localStorage.getItem("redirect")) {
        localStorage.setItem("token", token);
        const redirect = localStorage.getItem("redirect");
        navigate(redirect);
        localStorage.removeItem("redirect");
      } else {
        localStorage.setItem("token", token); // save token to local storage
        navigate("/");
      }
    }
  }, [user, token, navigate]);

  return (
    <AuthLayout title="Sign In">
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
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>

        <div className="mt-4 text-sm text-gray-600">
          <span>Not a Patient? </span>
          <Link
            to="/dsignin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in as Doctor
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
