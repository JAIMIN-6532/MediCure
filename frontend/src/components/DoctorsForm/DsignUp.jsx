import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate
import { Eye, EyeOff, Loader } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';

const DsignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    otp: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate function
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'name') {
      const namePattern = /^Dr [A-Za-z]\. [A-Za-z]\. [A-Za-z]+$/;
      if (!namePattern.test(e.target.value)) {
        setNameError('Name should be in the format "Dr A J [lastName]".');
      } else {
        setNameError('');
      }
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');  // Reset error message on OTP request

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/otp/send`, { email: formData.email });
      console.log('OTP Sent:', response.data);
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      setError(err.response ? err.response.data : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset the error message
    if (nameError) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/doctor/dsignup`, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        otp: formData.otp,
      });
  
      console.log('User Created:', response.data);
      localStorage.setItem('did', JSON.stringify(response.data._id));
      navigate('/doctor-signup'); // Redirect on success
    } catch (err) {
      console.error('Signup failed:', err);
  
      // Check for specific error messages from the backend
      if (err.response?.data?.error === "DoctorEmail already exists") {
        setError('An account with this email already exists. Please try for signin.');
      } else if (err.response?.data?.error === 'Invalid OTP') {
        setError('The OTP you entered is incorrect. Please try again.');
      } else {
        setError(err.response?.data?.error || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout title="Doctor Sign Up">
      <form onSubmit={otpSent ? handleSubmit : handleSendOtp} className="space-y-4">
        <div>
        <p className="text-sm text-gray-500 mb-2">
            <strong>Full Name:</strong> Please enter your name in the format:
            <strong> Dr A J Rathod</strong>. For example, if your full name is 
            "John Doe", you should write it as <strong>Dr J D Doe</strong>.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your full name"
            required
          />
           {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>

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
            required
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
              placeholder="Create a password"
              required
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

        {otpSent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Verification
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter OTP"
              maxLength="6"
              required
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error }</div>  
        )}

        <button
          type="submit"
          disabled={loading || nameError}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <span>{otpSent ? 'Create Account' : 'Send OTP'}</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/DsignIn" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign In
          </Link>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Are you a Patient?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default DsignUp;
