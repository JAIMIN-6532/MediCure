import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // to get doctor ID from URL
import DoctorProfile from '../../components/PatientsPage/DoctorProfile';
import TabNavigation from '../../components/PatientsPage/TabNavigation';
// import LocationCard from '../../components/PatientsPage/LocationCard';
import ReviewCard from '../../components/PatientsPage/ReviewCard';
import BusinessHours from '../../components/PatientsPage/BusinessHours';
import { fetchDoctorById, resetDoctorState } from '../../reduxToolkit/reducers/DoctorReducer.js';

export default function DoctorProfilePage() {
  const { doctorId } = useParams(); // Get the doctorId from the URL
  const dispatch = useDispatch();
  const { selectedDoctor, fetchDoctorByIdStatus, error } = useSelector((state) => state.doctors);
  const [activeTab, setActiveTab] = useState('Locations');
  
  // Store the previous doctorId to compare on each render
  const [prevDoctorId, setPrevDoctorId] = useState(null);

  useEffect(() => {
    if (doctorId !== prevDoctorId) {
      // Only reset the state if the doctorId has actually changed
      dispatch(resetDoctorState());
      setPrevDoctorId(doctorId); // Update the previous doctorId after resetting
      dispatch(fetchDoctorById(doctorId)); // Fetch new doctor data
    }
  }, [doctorId, prevDoctorId, dispatch]); // Run when doctorId or prevDoctorId changes

  // Handle loading and error state
  if (fetchDoctorByIdStatus === 'loading') {
    return <div>Loading...</div>;
  }
  if (fetchDoctorByIdStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  // Use dynamic data from selectedDoctor
  const locations = selectedDoctor?.clinicaddress || [];
  const reviews = selectedDoctor?.feedbacks || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 pt-[80px]">
      <div className="w-[85%] max-w-6xl mx-auto">
        <DoctorProfile doctor={selectedDoctor} /> {/* Pass the doctor data */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
          {/* {activeTab === 'Locations' && (
            <div className="space-y-6">
              {locations.length > 0 ? (
                locations.map((location, index) => (
                  <LocationCard key={index} {...location} />
                ))
              ) : (
                <p>No locations available for this doctor.</p>
              )}
            </div>
          )} */}

          {activeTab === 'Reviews' && (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewCard key={index} {...review} />
                ))
              ) : (
                <p>No reviews available for this doctor.</p>
              )}
            </div>
          )}

          {activeTab === 'Business Hours' && (
            <BusinessHours businessHours={selectedDoctor?.availability} />
          )}
        </div>
      </div>
    </div>
  );
}
