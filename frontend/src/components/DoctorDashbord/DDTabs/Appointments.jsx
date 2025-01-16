

const appointments = [
  {
    id: 1,
    name: "Emma Thompson",
    time: "09:00 AM",
    type: "General Checkup",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    status: "Upcoming",
    duration: "30 mins"
  },
  {
    id: 2,
    name: "Michael Chen",
    time: "10:30 AM",
    type: "Follow-up",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "In Progress",
    duration: "45 mins"
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    time: "02:00 PM",
    type: "Consultation",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "Upcoming",
    duration: "1 hour"
  },
  {
    id: 4,
    name: "James Wilson",
    time: "03:30 PM",
    type: "Emergency",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "Pending",
    duration: "1 hour"
  },
  {
    id: 5,
    name: "Olivia Brown",
    time: "04:45 PM",
    type: "Regular Checkup",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "Confirmed",
    duration: "30 mins"
  }
];
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

// Helper function to get status colors
const getStatusColor = (status) => {
  const colors = {
    'Upcoming': 'bg-blue-50 text-blue-600',
    'In Progress': 'bg-yellow-50 text-yellow-600',
    'Completed': 'bg-green-50 text-green-600',
    'Cancelled': 'bg-red-50 text-red-600',
    'Pending': 'bg-purple-50 text-purple-600',
    'Confirmed': 'bg-emerald-50 text-emerald-600'
  };
  return colors[status] || 'bg-gray-50 text-gray-600';
};

// Appointments Component
export default function Appointments() {
  useEffect(() => {
    gsap.fromTo('.appointments-title', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo('.appointments-list', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1 });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="appointments-title text-2xl font-bold">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your appointments and schedule</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <span>New Appointment</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-primary text-white rounded-lg">Today</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Upcoming</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Past</button>
          <div className="flex-1"></div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="appointments-list space-y-4">
          {appointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <img
                  src={appointment.image}
                  alt={appointment.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{appointment.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{appointment.time}</span>
                    <span>•</span>
                    <span>{appointment.type}</span>
                    <span>•</span>
                    <span>{appointment.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <button className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors">
                  Start Session
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
