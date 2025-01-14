
// DoctorSignUp.jsx
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import DsignUp from '../../components/DoctorsForm/DsignUp';
import Step1 from '../../components/DoctorsForm/Step1';
import Step2 from '../../components/DoctorsForm/Step2';
import Step3 from '../../components/DoctorsForm/Step3';
const DoctorSignUp = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: null,
    idProof: null,
    degreeProof: null,
    gender: '',
    serviceType: '',
    clinicAddress: '',
    city: '',
    state: '',
    phone: '',
    specialization: '',
    experience: '',
    availability: [],
    slots: [],
    consultationFee: '',
  });

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} handleFileChange={handleFileChange} />;
      case 2:
        return <Step2 formData={formData} handleChange={handleChange} />;
      case 3:
        return <Step3 formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <AuthLayout title="Doctor Sign Up">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className={`flex items-center ${stepNumber !== 3 ? 'flex-1' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber !== 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">Profile</span>
          <span className="text-sm">Details</span>
          <span className="text-sm">Schedule</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto flex items-center text-blue-600 hover:text-blue-700"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <span>Complete Sign Up</span>
              )}
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default DoctorSignUp;
