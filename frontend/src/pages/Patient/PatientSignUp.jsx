import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { patientSignUp } from "../../reduxToolkit/reducers/AuthReducer";
import AuthLayout from "../../components/AuthLayout";


const PatientSignUp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    otp: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
      password
    );
  };

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!validateEmail(value)) return "Please enter a valid email address.";
        return "";
      case "password":
        if (!value.trim()) return "Password is required.";
        if (!validatePassword(value)) {
          return "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.";
        }
        return "";
      case "otp":
        if (otpSent && value.trim().length !== 6)
          return "OTP must be exactly 6 digits.";
        return "";
      default:
        return "";
    }
  };

  const isFormValid = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    )
      return false;
    if (!validateEmail(formData.email) || !validatePassword(formData.password))
      return false;
    if (otpSent && formData.otp.trim().length !== 6) return false;
    if (
      fieldErrors.name ||
      fieldErrors.email ||
      fieldErrors.password ||
      (otpSent && fieldErrors.otp)
    ) {
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    setGlobalError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError("");

    const emailError = validateField("email", formData.email);
    if (emailError) {
      setFieldErrors({ ...fieldErrors, email: emailError });
      setGlobalError(emailError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/otp/send`,
        { email: formData.email }
      );
      // console.log("OTP Sent:", response.data);
      setOtpSent(true);
    } catch (err) {
      // console.log(err);
      setGlobalError(err.response ? err.response.data : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError("");

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    if (emailError || passwordError) {
      setFieldErrors({
        ...fieldErrors,
        email: emailError,
        password: passwordError,
      });
      setGlobalError(emailError || passwordError);
      setLoading(false);
      return;
    }

    try {
      const resultAction = await dispatch(patientSignUp(formData));
      // console.log("dcsdz", resultAction);
      if (patientSignUp.fulfilled.match(resultAction)) {
        // console.log("User Created:", resultAction.payload);
        localStorage.setItem("pid", JSON.stringify(resultAction.payload._id));
        navigate("/signin");
      } else {
        if (resultAction.payload?.error === "Email already exists") {
          setGlobalError(
            "An account with this email already exists. Please try for signin."
          );
        } else if (resultAction.payload?.error === "Invalid OTP") {
          setGlobalError("The OTP you entered is incorrect. Please try again.");
        } else {
          setGlobalError(resultAction.payload?.error || "An error occurred.");
        }
      }
    } catch (err) {
      // console.error("Signup failed:", err);
      setGlobalError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Patient Sign Up">
      <form
        onSubmit={otpSent ? handleSubmit : handleSendOtp}
        className="space-y-4"
      >
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
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
          )}
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
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
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
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}
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
            />
            {fieldErrors.otp && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.otp}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className={`w-full text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            loading || !isFormValid()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <span>{otpSent ? "Create Account" : "Send OTP"}</span>
          )}
        </button>
        {globalError && (
          <p className="text-red-500 text-sm mt-2">{globalError}</p>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </Link>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Are you a doctor?{" "}
          <Link
            to="/dsignup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
export default PatientSignUp;
