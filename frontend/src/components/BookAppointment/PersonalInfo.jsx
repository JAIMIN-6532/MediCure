import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMoneyBill, FaWallet, FaHandshake } from 'react-icons/fa';

export default function PersonalInfo({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'offline',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FaUser className="text-primary" />
        Personal Information
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="John"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaPhone className="text-primary" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaWallet className="text-primary" />
            Payment Method
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-6 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-primary hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="offline"
                checked={formData.paymentMethod === 'offline'}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <div className="flex items-center gap-3 flex-1">
                <FaMoneyBill className="text-green-500 text-2xl" />
                <div>
                  <span className="text-gray-700 font-medium block">Pay at Clinic</span>
                  <span className="text-sm text-gray-500">Pay with cash or card at the clinic</span>
                </div>
              </div>
              <span className="text-green-500 font-semibold">Available</span>
            </label>

            <label className="flex items-center gap-3 p-6 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-primary hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === 'online'}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <div className="flex items-center gap-3 flex-1">
                <FaHandshake className="text-blue-500 text-2xl" />
                <div>
                  <span className="text-gray-700 font-medium block">Pay Online</span>
                  <span className="text-sm text-gray-500">Secure payment after appointment confirmation</span>
                </div>
              </div>
              <span className="text-blue-500 font-semibold">Recommended</span>
            </label>
          </div>
        </div>

        {formData.paymentMethod === 'online' && (
          <div className="mt-6 bg-blue-50 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-blue-900 font-medium">Online Payment Information</h4>
                <p className="text-sm text-blue-700 mt-1">
                  After booking confirmation, you'll receive payment instructions via email. You can complete the payment securely through our payment gateway.
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.paymentMethod === 'offline' && (
          <div className="mt-6 bg-green-50 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-green-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-green-900 font-medium">Pay at Clinic</h4>
                <p className="text-sm text-green-700 mt-1">
                  You can pay using cash, credit/debit card, or any other accepted payment method at the clinic during your visit.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
              required
            />
            <span className="text-sm text-gray-700">
              I have read and accept the{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                Terms & Conditions
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-8 w-full md:w-auto px-8 py-4 bg-primary text-white rounded-lg font-semibold 
                   hover:bg-blue-600 transition-all transform hover:scale-105 focus:outline-none 
                   focus:ring-2 focus:ring-primary focus:ring-opacity-50 shadow-lg"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}