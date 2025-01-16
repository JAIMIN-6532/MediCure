import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useSelector,useDispatch } from 'react-redux';
import { doctorSignIn } from '../reduxToolkit/reducers/AuthReducer.js';
import { useEffect } from 'react';

const DsignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user, token } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(doctorSignIn(formData));
  }

  // Redirect if token is already in localStorage
    useEffect(() => {
      const savedToken = token;
      const doctorId = user?._id;
      if (savedToken) {
        navigate(`/d-dashbord/${doctorId}`);
      }
    }, [navigate]);
  
    // Redirect and save token to localStorage if user successfully signs in
    useEffect(() => {

      if (user && token) {
        const doctorId = user._id;
        localStorage.setItem('token', token); // Save token to local storage
        navigate(`/d-dashbord/${doctorId}`); // Redirect to the home page after successful sign-in
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
              type={showPassword ? 'text' : 'password'}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot Password?
          </Link>
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
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/dsignup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>

        {/* Link to switch between Doctor and Patient Sign In */}
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
