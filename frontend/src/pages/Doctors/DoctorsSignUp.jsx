// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronRight, ChevronLeft, Loader } from "lucide-react";
// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import AuthLayout from "../../components/AuthLayout";
// import Step1 from "../../components/DoctorsForm/Step1";
// import Step2 from "../../components/DoctorsForm/Step2";
// import Step3 from "../../components/DoctorsForm/Step3";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { fetchDoctorById } from "../../reduxToolkit/reducers/DoctorReducer";

// const DoctorSignUp = () => {
//   const dispatch = useDispatch();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     profileImage: null,
//     idProof: null,
//     degreeProof: null,
//     gender: "",
//     serviceType: "",
//     clinicaddress: "",
//     city: "",
//     state: "",
//     phone: "",
//     specialization: "",
//     experience: 1,
//     selectedDays: [], // Days the user has selected
//     selectedSlots: [], // Slots the user has selected
//     availability: [], // Final availability to send to the API
//     consultationFee: 1,
//   });

//   const doctor = JSON.parse(localStorage.getItem("user"));
//   let did;
//   const did1 = JSON.parse(localStorage.getItem("did"));
//   const did2 = doctor?._id;
//   console.log(did1, did2);
//   if (did1) {
//     did = did1;
//   } else {
//     did = did2;
//   }

//   console.log(did);  

//   const navigate = useNavigate();
//   const handleFileChange = (e, field) => {
//     setFormData({ ...formData, [field]: e.target.files[0] });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Step 1 API call
//   const uploadStep1Documents = async (doctorId, formData) => {
//     const formDataToSend = new FormData();
//     formDataToSend.append("images", formData.profileImage);
//     formDataToSend.append("id", formData.idProof);
//     formDataToSend.append("degree", formData.degreeProof);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_API_URL}/api/doctor/${doctorId}/uploaddoc1`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error uploading documents for Step 1", error);
//       throw error;
//     }
//   };

//   // Step 2 API call
//   const uploadStep2Details = async (doctorId, formData) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_API_URL}/api/doctor/${doctorId}/uploaddoc2`,
//         {
//           gender: formData.gender,
//           serviceType: formData.serviceType,
//           clinicaddress: formData.clinicaddress,
//           city: formData.city,
//           state: formData.state,
//           phone: formData.phone,
//           specialization: formData.specialization,
//           experience: formData.experience,
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error uploading details for Step 2", error);
//       throw error;
//     }
//   };

//   // Step 3 API call
//   const uploadStep3Details = async (doctorId, formData) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_API_URL}/api/doctor/${doctorId}/uploaddoc3`,
//         {
//           consultationFee: formData.consultationFee,
//           availability: formData.availability,
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error("Error uploading details for Step 3", error);
//       throw error;
//     }
//   };

//   // Handle form submission for each step
//   const handleStepSubmit = async () => {
//     setLoading(true);
//     try {
//       if (step === 1) {
//         await uploadStep1Documents(did, formData); // Step 1 API call
//         setStep(2); // Move to Step 2
//       } else if (step === 2) {
//         await uploadStep2Details(did, formData); // Step 2 API call
//         setStep(3); // Move to Step 3
//       } else if (step === 3) {
//         const res = await uploadStep3Details(did, formData); // Step 3 API call
//         console.log("Doctor created:", res);
//         localStorage.setItem("doctor", JSON.stringify(res));   //we are setting Updated Doctor HEre WITH Steps=4
//         dispatch(fetchDoctorById(did)); // Re-fetch the updated doctor data from the backend
//         navigate(`/d-dashbord/${did}`); // Redirect to dashboard after successful signup
//         // Handle success (e.g., redirect or show success message)
//       }
//     } catch (error) {
//       console.error("Error during step submission", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <Step1
//             formData={formData}
//             handleFileChange={handleFileChange}
//             did={did}
//           />
//         );
//       case 2:
//         return (
//           <Step2 formData={formData} handleChange={handleChange} did={did} />
//         );
//       case 3:
//         return (
//           <Step3 formData={formData} handleChange={handleChange} did={did} />
//         );
//       default:
//         return null;
//     }
//   };

//   useEffect(() => {
//       // Scroll to top whenever the step changes
//       window.scrollTo(0, 0);
//     }, [step]); // This will trigger whenever `step` changes

//   return (
//     <AuthLayout title="Doctor Sign Up">
//       <div className="mb-8">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3].map((stepNumber) => (
//             <div
//               key={stepNumber}
//               className={`flex items-center ${
//                 stepNumber !== 3 ? "flex-1" : ""
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                   step >= stepNumber
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {stepNumber}
//               </div>
//               {stepNumber !== 3 && (
//                 <div
//                   className={`flex-1 h-1 mx-2 ${
//                     step > stepNumber ? "bg-blue-600" : "bg-gray-200"
//                   }`}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-2">
//           <span className="text-sm">Profile</span>
//           <span className="text-sm">Details</span>
//           <span className="text-sm">Schedule</span>
//         </div>
//       </div>

//       <form onSubmit={(e) => e.preventDefault()}>
//         {renderStep()}

//         <div className="mt-6 flex justify-between">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={() => setStep(step - 1)}
//               className="flex items-center text-blue-600 hover:text-blue-700"
//             >
//               <ChevronLeft size={20} />
//               <span>Previous</span>
//             </button>
//           )}
//           {step < 3 ? (
//             <button
//               type="button"
//               onClick={handleStepSubmit} // Trigger API for the current step
//               className="ml-auto flex items-center text-blue-600 hover:text-blue-700"
//             >
//               <span>Next</span>
//               <ChevronRight size={20} />
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={handleStepSubmit} // Submit form for Step 3
//               disabled={loading}
//               className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//             >
//               {loading ? (
//                 <Loader className="animate-spin" size={20} />
//               ) : (
//                 <span>Complete Sign Up</span>
//               )}
//             </button>
//           )}
//         </div>
//       </form>

//       <div className="mt-6 text-center">
//         <p className="text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link
//             to="/signin"
//             className="text-blue-600 hover:text-blue-700 font-medium"
//           >
//             Sign In
//           </Link>
//         </p>
//       </div>
//     </AuthLayout>
//   );
// };

// export default DoctorSignUp;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Loader } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Step1 from "../../components/DoctorsForm/Step1";
import Step2 from "../../components/DoctorsForm/Step2";
import Step3 from "../../components/DoctorsForm/Step3";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchDoctorById } from "../../reduxToolkit/reducers/DoctorReducer";

const DoctorSignUp = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: null,
    idProof: null,
    degreeProof: null,
    gender: "",
    serviceType: "",
    clinicaddress: "",
    city: "",
    state: "",
    phone: "",
    specialization: "",
    experience: 1,
    selectedDays: [], // Days the user has selected
    selectedSlots: [], // Slots the user has selected
    availability: [], // Final availability to send to the API
    consultationFee: 1,
  });

  const doctor = JSON.parse(localStorage.getItem("user"));
  let did;
  const did1 = JSON.parse(localStorage.getItem("did"));
  const did2 = doctor?._id;
  console.log(did1, did2);
  if (did1) {
    did = did1;
  } else {
    did = did2;
  }

  console.log(did);  

  const navigate = useNavigate();
  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1 API call
  const uploadStep1Documents = async (doctorId, formData) => {
    const formDataToSend = new FormData();
    formDataToSend.append("images", formData.profileImage);
    formDataToSend.append("id", formData.idProof);
    formDataToSend.append("degree", formData.degreeProof);
    console.log("Form Data to send:", formDataToSend);
    try {
      console.log("Form Data to send:", formDataToSend);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/doctor/${doctorId}/uploaddoc1`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading documents for Step 1", error);
      throw error;
    }
  };

  // Step 2 API call
  const uploadStep2Details = async (doctorId, formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/doctor/${doctorId}/uploaddoc2`,
        {
          gender: formData.gender,
          serviceType: formData.serviceType,
          clinicaddress: formData.clinicaddress,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: formData.experience,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading details for Step 2", error);
      throw error;
    }
  };

  // Step 3 API call
  const uploadStep3Details = async (doctorId, formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/doctor/${doctorId}/uploaddoc3`,
        {
          consultationFee: formData.consultationFee,
          availability: formData.availability,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading details for Step 3", error);
      throw error;
    }
  };

  // Handle form submission for each step
  const handleStepSubmit = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        await uploadStep1Documents(did, formData); // Step 1 API call
        setStep(2); // Move to Step 2
      } else if (step === 2) {
        await uploadStep2Details(did, formData); // Step 2 API call
        setStep(3); // Move to Step 3
      } else if (step === 3) {
        const res = await uploadStep3Details(did, formData); // Step 3 API call
        console.log("Doctor created:", res);
        localStorage.setItem("doctor", JSON.stringify(res));   //we are setting Updated Doctor HEre WITH Steps=4
        dispatch(fetchDoctorById(did)); // Re-fetch the updated doctor data from the backend
        navigate(`/d-dashbord/${did}`); // Redirect to dashboard after successful signup
        // Handle success (e.g., redirect or show success message)
      }
    } catch (error) {
      console.error("Error during step submission", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            formData={formData}
            handleFileChange={handleFileChange}
            did={did}
          />
        );
      case 2:
        return (
          <Step2 formData={formData} handleChange={handleChange} did={did} />
        );
      case 3:
        return (
          <Step3 formData={formData} handleChange={handleChange} did={did} />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Scroll to top whenever the step changes
    window.scrollTo(0, 0);
  }, [step]); // This will trigger whenever `step` changes

  return (
    <AuthLayout title="Doctor Sign Up">
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader className="animate-spin text-white" size={40} />
        </div>
      )}

      {/* Only apply the blur effect to the AuthLayout content */}
      <div className={loading ? "blur-md" : ""}>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber !== 3 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {stepNumber}
                </div>
                {stepNumber !== 3 && (
                  <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
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

        <form onSubmit={(e) => e.preventDefault()}>
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
                onClick={handleStepSubmit} // Trigger API for the current step
                className="ml-auto flex items-center text-blue-600 hover:text-blue-700"
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStepSubmit} // Submit form for Step 3
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
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default DoctorSignUp;
