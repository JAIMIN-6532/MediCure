import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import DoctorProfile from './DoctorProfile';
// import TabNavigation from './TabNavigation';
// import BusinessHours from './BusinessHours';
// import ReviewCard from './ReviewCard';
import DoctorProfile from "../../components/PatientsPage/DoctorProfile";
import TabNavigation from "../../components/PatientsPage/TabNavigation";
import BusinessHours from "../../components/PatientsPage/BusinessHours";
import ReviewCard from "../../components/PatientsPage/ReviewCard";
import { fetchDoctorAvgRatingByDoctorId } from '../../reduxToolkit/reducers/DoctorReducer';

import { fetchDoctorById, resetDoctorState } from '../../reduxToolkit/reducers/DoctorReducer';

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const dispatch = useDispatch();
  const { selectedDoctor, fetchDoctorByIdStatus, error } = useSelector((state) => state.doctors);
  const avgRating = useSelector((state) => state.doctors.avgRating);
  const fetchAvgRatingStatus = useSelector((state) => state.doctors.fetchDoctorAvgRatingStatus);
  const [activeTab, setActiveTab] = useState('Reviews');

  const [prevDoctorId, setPrevDoctorId] = useState(null);

  useEffect(() => {
    if (doctorId !== prevDoctorId) {
      dispatch(resetDoctorState());

      setPrevDoctorId(doctorId);
      dispatch(fetchDoctorById(doctorId));
      dispatch(fetchDoctorAvgRatingByDoctorId(doctorId));
    }
  }, [doctorId, prevDoctorId, dispatch]);

  if(fetchAvgRatingStatus === 'loading') {
    return <div>Loading...</div>;
  }
  if(fetchAvgRatingStatus === 'failed') {
    return <div>Error: {error}</div>;
  }


  if (fetchDoctorByIdStatus === 'loading') {
    return <div>Loading...</div>;
  }
  if (fetchDoctorByIdStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  const reviews = selectedDoctor?.feedbacks || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 pt-[80px]">
      <div className="w-[85%] max-w-6xl mx-auto">
        <DoctorProfile doctor={selectedDoctor} avgRating = {avgRating} />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
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
