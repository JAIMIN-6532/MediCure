import { useEffect } from 'react';
import gsap from 'gsap';
// import { filteredAppointments } from './AppointmentList';

const stats = [
  { 
    title: 'Total Appointments', 
    value: '978', 
    change: '+15% from last week',
    icon: '👥',
    color: 'bg-blue-50 text-blue-600'
  },
  // { 
  //   title: 'Today\'s Patients', 
  //   value: '80', 
  //   change: '+15% from yesterday',
  //   icon: '📅',
  //   color: 'bg-purple-50 text-purple-600'
  // },
  { 
    title: 'Appointments Today', 
    value: "ta",
    change: '+20% from yesterday',
    icon: '🕒',
    color: 'bg-green-50 text-green-600'
  },
  { 
    title: 'Total Revenue', 
    value: 'tr', 
    change: '+25% from last month',
    icon: '💰',
    color: 'bg-yellow-50 text-yellow-600'
  }
];

// Helper function to sanitize the title into a valid CSS class name
const sanitizeTitle = (title) => {
  return title.replace(/[^a-zA-Z0-9-_]/g, '-'); // Replace spaces, apostrophes, etc., with hyphens
};

export default function Stats({ filteredAppointments ,doctor,appointments}) {
  console.log(doctor);
  console.log(appointments)
  useEffect(() => {
    // Animate each stat card when they appear
    stats.forEach((stat, index) => {
      const sanitizedClass = sanitizeTitle(stat.title); // Sanitize the title
      gsap.fromTo(
        `.${sanitizedClass}`,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          delay: index * 0.1,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    });
  }, []);

  return (
    <div className="flex flex-wrap gap-6 mb-8">
      {stats.map((stat) => {
        const sanitizedClass = sanitizeTitle(stat.title); // Sanitize the title for each stat

        return (
          <div
            key={stat.title}
            className={`${sanitizedClass} stats-card flex-1 min-w-[250px]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value==="ta"?  filteredAppointments?.length : stat.value==="tr"?  "₹ "+doctor?.totalRevenue : appointments?.length}</p>
                {/* <p className="text-sm text-green-500 mt-1">{stat.change}</p> */}
              </div>
              <span className={`text-2xl p-3 rounded-xl ${stat.color}`}>{stat.icon}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
