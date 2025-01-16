

const appointments = [
  {
    id: 1,
    name: "Emma Thompson",
    time: "09:00 AM",
    type: "General Checkup",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    status: "Confirmed"
  },
  {
    id: 2,
    name: "Michael Chen",
    time: "10:30 AM",
    type: "Follow-up",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "In Progress"
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    time: "02:00 PM",
    type: "Consultation",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "Scheduled"
  }
];

import { useEffect } from 'react';
import gsap from 'gsap';

const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-50 text-green-600';
    case 'In Progress':
      return 'bg-blue-50 text-blue-600';
    case 'Scheduled':
      return 'bg-yellow-50 text-yellow-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

export default function AppointmentList() {
  useEffect(() => {
    // Animate each appointment item when they appear
    appointments.forEach((appointment, index) => {
      gsap.fromTo(
        `.appointment-${appointment.id}`,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          delay: index * 0.1,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    });
  }, [appointments]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Today's Appointments</h2>
          <p className="text-gray-500 text-sm mt-1">You have {appointments.length} appointments today</p>
        </div>
        <button className="text-primary hover:text-blue-700 transition-colors font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`appointment-${appointment.id} flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100`}
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              <button className="px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
