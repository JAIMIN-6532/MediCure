import React, { useEffect, useRef } from 'react';
import { animateCounterElement, initScrollTriggerAnimations } from './Animations';

// Sample data 
const stats = [
  { value: "30", label: "Registered Users", suffix: "k+", icon: "👥" },
  { value: "1.5", label: "Expert Doctors", suffix: "k+", icon: "👨‍⚕️" },
  { value: "15", label: "Appointments Booked", suffix: "k+", icon: "📅" },
  { value: "99", label: "Satisfied Patients", suffix: "%", icon: "😊" }
];

const AnimatedCounters = () => {
  const statsRef = useRef(null);

  useEffect(() => {
   
    const scrollObserver = initScrollTriggerAnimations();
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter-element');
      counters.forEach((counter) => {
        const countTo = counter.getAttribute('data-count-to');
        const delay = parseInt(counter.getAttribute('data-delay')) || 0;
        setTimeout(() => {
          animateCounterElement(counter, countTo, 2000);
        }, delay);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect(); // Animate only once
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      if (scrollObserver) scrollObserver.disconnect();
    };
  }, []);

  return (
    <div ref={statsRef} className="mt-24 relative px-4 w-[90%] mx-auto"> 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 p-6 text-center relative overflow-hidden group"
          >
           
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 rounded-full text-2xl shadow-sm">
                {stat.icon}
              </div>

              <div className="flex justify-center items-baseline">
                <h3 className="text-5xl font-extrabold mb-2 flex items-center justify-center">
                  <span 
                    className="scroll-trigger inline-block text-gradient counter-element" 
                    data-animation="counter"
                    data-count-to={stat.value}
                    data-delay={index * 100}
                  >
                    0
                  </span>
                  <span className="ml-1 text-gradient">{stat.suffix}</span>
                </h3>
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>

            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-200 group-hover:border-blue-400 transition-colors duration-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-200 group-hover:border-blue-400 transition-colors duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCounters;
