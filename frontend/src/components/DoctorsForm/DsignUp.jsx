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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
   
    setLoading(true);
    // Simulate OTP sending

    try{
      const response = await axios.post('http://localhost:3000/api/otp/send', { email: formData.email });
      console.log('OTP Sent:', response.data);
      setOtpSent(true);

    }catch(err){
      console.log(err);
      setError(err.response ? err.response.data : 'Failed to send OTP.');
    }finally{
      setLoading(false);
    }

    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission here (e.g., save data to API)
    try {
      // Send the signup request to the server
      const response = await axios.post('http://localhost:3000/api/doctor/dsignup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        otp: formData.otp,
      });
      console.log('User Created:', response.data);
      localStorage.setItem('did', JSON.stringify(response.data._id));
      // alert('User successfully registered!');
      navigate('/doctor-signup');  // Redirect to /doctor-signup after submission
      
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response ? err.response.data : 'An error occurred.');
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
      navigate('/doctor-signup');  // Redirect to /doctor-signup after submission
    }, 1500);
  };

  return (
    <AuthLayout title="Doctor Sign Up">
      <form onSubmit={otpSent ? handleSubmit : handleSendOtp} className="space-y-4">
        <div>
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

        <button
          type="submit"
          disabled={loading}
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
