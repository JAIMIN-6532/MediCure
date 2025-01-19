import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBill,
  FaWallet,
  FaHandshake,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function PersonalInfo({
  patient,
  onSubmit,
  selectedSlot,
  selectedDate,
  doctor
}) {
  console.log("patient from Personal Info", patient);
  const { doctorId } = useParams();
  const [formData, setFormData] = useState({
    doctorId: doctorId,
    patientId: patient._id,
    firstName: patient.name,
    lastName: "",
    email: patient.email,
    phone: "",
    selectedDate: selectedDate,
    selectedSlot: selectedSlot,
    paymentMethod: "Offline",
    acceptTerms: false,
    type: "",
    serviceType: doctor?.serviceType === "Both" ? null : doctor?.serviceType // Initialize serviceType based on doctor's serviceType
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle the service type selection change
  const handleServiceTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      serviceType: type,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FaUser className="text-primary" />
        Personal Information
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
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
            
            {/* Service Type Selection if Doctor Offers Both */}
            {doctor?.serviceType === "Both" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Choose Service Type
                </h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleServiceTypeChange("Online")}
                    className={`px-6 py-2 rounded-lg ${
                      formData.serviceType === "Online"
                        ? "bg-primary text-white"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => handleServiceTypeChange("Offline")}
                    className={`px-6 py-2 rounded-lg ${
                      formData.serviceType === "Offline"
                        ? "bg-primary text-white"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    Offline
                  </button>
                </div>
              </div>
            )}

            {/* If the doctor offers only one type, automatically select it */}
            
          </div>
          {doctor?.serviceType === "Online" && (
              <div className="text-center text-red-900 text-2xl">
                Only Online appointments available.
              </div>
            )}
            {doctor?.serviceType === "Offline" && !formData.serviceType && (
              <div className="text-center text-gray-500 mb-6">
                Only Offline appointments available.
              </div>
            )}
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
                checked={formData.paymentMethod === "offline"}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <div className="flex items-center gap-3 flex-1">
                <FaMoneyBill className="text-green-500 text-2xl" />
                <div>
                  <span className="text-gray-700 font-medium block">
                    Pay at Clinic
                  </span>
                  <span className="text-sm text-gray-500">
                    Pay with cash or card at the clinic
                  </span>
                </div>
              </div>
              <span className="text-green-500 font-semibold">Available</span>
            </label>

            <label className="flex items-center gap-3 p-6 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-primary hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === "online"}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <div className="flex items-center gap-3 flex-1">
                <FaHandshake className="text-blue-500 text-2xl" />
                <div>
                  <span className="text-gray-700 font-medium block">
                    Pay Online
                  </span>
                  <span className="text-sm text-gray-500">
                    Secure payment after appointment confirmation
                  </span>
                </div>
              </div>
              <span className="text-blue-500 font-semibold">Recommended</span>
            </label>
          </div>
        </div>

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
              I have read and accept the{" "}
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
