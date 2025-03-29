import React, { useEffect,useState } from "react";
import { gsap } from "gsap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorAvgRatingByDoctorId } from "../../../reduxToolkit/reducers/DoctorReducer.js";
import patient from "../../../assets/patient.png";

//sample data 
const patients = [
  {
    id: 1,
    name: "Emma Thompson",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    lastVisit: "3 days ago",
    age: 32,
    condition: "Hypertension"
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    lastVisit: "1 week ago",
    age: 45,
    condition: "Diabetes"
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    lastVisit: "2 weeks ago",
    age: 28,
    condition: "Asthma"
  },
  {
    id: 4,
    name: "James Wilson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    lastVisit: "1 month ago",
    age: 52,
    condition: "Arthritis"
  },
  {
    id: 5,
    name: "Olivia Brown",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    lastVisit: "2 days ago",
    age: 39,
    condition: "Migraine"
  }
];

export default function Patients({doctor}) {

  const dispatch = useDispatch();
  useEffect(() => {
    gsap.fromTo('.patients-title', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo('.patients-list', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 });
  }, []);
  const  avgRating  = useSelector((state) => state.doctors.avgRating);
  const {doctorId} = useParams();
    useEffect(() => {
      if (doctorId) {
        
        dispatch(fetchDoctorAvgRatingByDoctorId(doctorId)); 
      }
    }, [doctorId, dispatch]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-col rounded-xl shadow-lg p-6">
        
        <div>
          <h1 className="patients-title text-2xl font-bold">My Reviews</h1>
        </div>
        <div>
        <h1 className="patients-title text-2xl text-yellow-500 font-bold">⭐ {avgRating?.toFixed(2)}/5</h1>
      </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
        <div className="patients-list space-y-4 ">
          {doctor?.feedbacks.map((fb, index) => (
            <div
              key={doctor.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 relative"
            >
              <div className="flex items-center gap-4">
                <img
                  src={patient}
                  alt={fb.patient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
               
                <div>
                  <div className="flex items-center gap-2">
                  <h4 className="font-medium">{fb.patient.name}  <span className="text-green-500">⭐ {fb.rating.toFixed(2)}/5.00</span></h4>
                  </div>
                  <div className="flex items-center  gap-2 text-md text-gray-600">
                    <div>
                      <span >{fb.comment}</span>
                    </div>
                  </div>
                </div>
                <h4 className="absolute top-2 right-4">{fb?.createdAt.split("T")[0]}</h4>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}