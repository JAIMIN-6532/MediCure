// src/components/DoctorDashbord/DDashbord/AnimatedTransition.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedTransition({ 
  children, 
  type = 'fade', 
  delay = 0,
  className 
}) {
  const ref = useRef(null);

  useEffect(() => {
    const animProps = {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.5,
      delay,
      ease: 'power3.out'
    };

    switch(type) {
      case 'scale':
        gsap.from(ref.current, { scale: 0.95, ...animProps });
        break;
      case 'slide-right':
        gsap.from(ref.current, { x: 50, ...animProps });
        break;
      case 'slide-left':
        gsap.from(ref.current, { x: -50, ...animProps });
        break;
      default: // fade
        gsap.from(ref.current, { opacity: 0, ...animProps });
    }
  }, [type, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}