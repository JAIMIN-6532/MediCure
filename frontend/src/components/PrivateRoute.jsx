import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDoctorById } from "../reduxToolkit/reducers/DoctorReducer";

const PrivateRoute = ({ element, ...rest }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  // Get selectedDoctor and the status of fetching doctor data from Redux state
  const { selectedDoctor, fetchDoctorByIdStatus } = useSelector((state) => state.doctors);
  
  const [isLoading, setIsLoading] = useState(true); // track the loading state

  // Use useEffect to fetch the doctor data by ID when user exists
  useEffect(() => {
    if (user && user._id && fetchDoctorByIdStatus === "idle") {
      dispatch(fetchDoctorById(user._id));  // Fetch doctor by ID
    }
  }, [dispatch, fetchDoctorByIdStatus, user, ]);  // Dependency array ensures this effect runs when necessary

  // Once the doctor data is fetched, set isLoading to false
  useEffect(() => {
    if (fetchDoctorByIdStatus === "succeeded") {
      setIsLoading(false);  // Set loading state to false once data is fetched
    }
  }, [fetchDoctorByIdStatus]);  // Only run this when fetchDoctorByIdStatus changes

  // If the user is not logged in, redirect to the sign-in page
  if (!user || !token) {
    return <Navigate to="/dsignin" />;
  }

  // If doctor data is still loading, don't check for steps yet
  if (isLoading) {
    return null; // Optionally, show a loading spinner while waiting for doctor data
  }

  // Check for steps only after data is successfully fetched
  const currentStep = selectedDoctor?.steps;

  // If the user hasn't completed all the steps, redirect to the sign-up page
  if (currentStep !== 4) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    return <Navigate to="/doctor-signup" />;
  }

  // If the user is authenticated and has completed all steps, render the element (protected route)
  return element;
};

export default PrivateRoute;
