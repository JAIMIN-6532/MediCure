import React, { useState, useEffect } from 'react';
import { ChevronRight, Star } from 'lucide-react';

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    name: 'Emma Thompson',
    date: '2 weeks ago',
    rating: 5,
    text: 'I had an excellent experience with this platform. The appointment booking was seamless, and the doctor was very attentive to my concerns. Highly recommend!',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    id: 2,
    name: 'Robert Garcia',
    date: '1 month ago',
    rating: 4,
    text: 'The Medicure platform made it incredibly easy to find a specialist and book an appointment. The doctor was knowledgeable and took time to explain everything.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Sophie Chen',
    date: '3 weeks ago',
    rating: 5,
    text: "I've been using Medicure for all my family's healthcare consultations. The service is consistently excellent. So grateful for this platform!",
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  }
];

// Card component for individual testimonial
const TestimonialCard = ({ testimonial, index, isVisible }) => {
  return (
    <div 
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 h-full flex flex-col transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
            }`} 
          />
        ))}
      </div>
      
      <p className="text-gray-700 mb-6 flex-grow">{testimonial.text}</p>
      
      <div className="flex items-center space-x-3">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.date}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);

  useEffect(() => {
    const testimonialsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTestimonialsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const testimonialsElement = document.getElementById('testimonials');
    if (testimonialsElement) testimonialsObserver.observe(testimonialsElement);
    
    return () => {
      if (testimonialsElement) testimonialsObserver.unobserve(testimonialsElement);
    };
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 transition-all duration-700 text-blue-500 ${testimonialsVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            What Our <span className="text-blue-500">Users Say</span>
          </h2>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-100 ${testimonialsVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            Read about the experiences of patients who have used our platform to find the right healthcare provider.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
              isVisible={testimonialsVisible}
            />
          ))}
        </div>
        
        
      </div>
    </section>
  );
};

export default Testimonials;
