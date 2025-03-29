import { useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'My-Appointments', icon: CalendarIcon },
];


export default function Navigation({ activeNav, setActiveNav }) {

  const handleNavHover = (e) => {
    gsap.to(e.target, { x: 5, duration: 0.3 });
  };

  const handleNavLeave = (e) => {
    gsap.to(e.target, { x: 0, duration: 0.3 });
  };

  const handleNavTap = (e) => {
    gsap.to(e.target, { scale: 0.95, duration: 0.1, ease: 'power2.out' });
  };

  const handleNavRelease = (e) => {
    gsap.to(e.target, { scale: 1, duration: 0.1, ease: 'power2.out' });
  };

  useEffect(() => {
    gsap.fromTo('.nav-link', { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          onClick={() => setActiveNav(item.name)}
          onMouseEnter={handleNavHover}
          onMouseLeave={handleNavLeave}
          onMouseDown={handleNavTap}
          onMouseUp={handleNavRelease}
          className={`nav-link ${activeNav === item.name ? 'active' : ''}`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
