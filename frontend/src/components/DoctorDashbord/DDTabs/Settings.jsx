import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDoctorById } from "../../../reduxToolkit/reducers/DoctorReducer";
const Settings = ({ doctor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: doctor.name,
    phone: doctor.phone,
    email: doctor.email,
    clinicaddress: doctor.clinicaddress,
    city: doctor.city,
    state: doctor.state,
    consultationFee: doctor.consultationFee,
    serviceType: doctor.serviceType,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data before appending:", formData);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/doctor/updateprofile/${
          doctor._id
        }`,
        formData
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(fetchDoctorById(doctor._id));
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen mt-[-30px]">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          <div className="w-full">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 pb-4 border-b border-gray-200">
                Profile Update
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                        transition-all duration-300 hover:border-blue-500/50"
                        placeholder="Dr. John Doe"
                      />
                      <div className="absolute inset-y-0 left-3 pl-1 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm"></span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                        transition-all duration-300 hover:border-blue-500/50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                        transition-all duration-300 hover:border-blue-500/50"
                        placeholder="doctor@example.com"
                      />
                    </div>
                  </div>

                  {/* Consultation Fee */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Consultation Fee (INR)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                        transition-all duration-300 hover:border-blue-500/50"
                        placeholder="150"
                      />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                      focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                      transition-all duration-300 hover:border-blue-500/50"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                        transition-all duration-300 hover:border-blue-500/50"
                        placeholder="New York"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                        transition-all duration-300 hover:border-blue-500/50"
                        placeholder="New York"
                      />
                    </div>
                  </div>
                </div>

                {/* Clinic Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Clinic Address
                  </label>
                  <textarea
                    name="clinicaddress"
                    value={formData.clinicaddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm 
                    focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                    transition-all duration-300 hover:border-blue-500/50 resize-none"
                    placeholder="123 Medical Plaza, Suite 100"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium 
                    hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
