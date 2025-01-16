import React, { useEffect,useState } from "react";
import { gsap } from "gsap";
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

export default function Patients() {
  useEffect(() => {
    gsap.fromTo('.patients-title', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo('.patients-list', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="patients-title text-2xl font-bold">My Patients</h1>
          <p className="text-gray-500 mt-1">View and manage your patient records</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <span>Add Patient</span>
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="patients-list space-y-4">
          {patients.map((patient, index) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <img
                  src={patient.image}
                  alt={patient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{patient.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Age: {patient.age}</span>
                    <span>•</span>
                    <span>{patient.condition}</span>
                    <span>•</span>
                    <span>Last visit: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors">
                  View Profile
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  Medical History
                </button>
                <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  Schedule Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}