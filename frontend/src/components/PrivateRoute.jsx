import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDoctorById } from "../reduxToolkit/reducers/DoctorReducer";

const PrivateRoute = ({ element, ...rest }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const { selectedDoctor, fetchDoctorByIdStatus } = useSelector((state) => state.doctors);
  const [isLoading, setIsLoading] = useState(true);
  console.log(selectedDoctor);
  useEffect(() => {
    if (user && user._id && fetchDoctorByIdStatus === "idle") {
      dispatch(fetchDoctorById(user._id));  
    }
  }, [dispatch, fetchDoctorByIdStatus, user]);  
  useEffect(() => {
    if (fetchDoctorByIdStatus === "succeeded") {
      setIsLoading(false); 
    }
  }, [fetchDoctorByIdStatus]);

  if (!user || !token) {
    return <Navigate to="/dsignin" />;
  }

  if (isLoading) {
    return null; 
  }

  const currentStep = selectedDoctor?.steps;

  // if the user hasn't completed all the steps, redirect to the sign-up page
  if (selectedDoctor?.steps !== 4) {
    return <Navigate to="/doctor-signup" />;
  }

  // iff the user is authenticated and has completed all steps, render the element (protected route)
  return element;
};

export default PrivateRoute;
