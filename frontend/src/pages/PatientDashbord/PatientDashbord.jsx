import React from 'react'
import Navigation from '../../components/PatientDashbord/Pdnavbar/Navigation';
import Profile from '../../components/PatientDashbord/Pdnavbar/Profile';
import Appointments from '../../components/PatientDashbord/PdTabs/Appointments';
const PatientDashbord = () => {
const [activeNav, setActiveNav] = useState('Dashboard');
  const renderContent = () => {
      switch (activeNav) {
        case 'My-Appointments':
          // return <Appointments appointments={appointments} doctor={doctor} />;
          return <Appointments />;
        default:
          return (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-2xl text-gray-500">Coming Soon...</h2>
            </div>
          );
      }
    };

    useEffect(()=>{
      gsap.fromTo(
        '.sidebar', 
        { x: -300 }, 
        { x: 0, duration: 0.5, ease: 'power2.out' }
      );
  
    },[])
  
    useEffect(() => {
      // GSAP animation for Sidebar
    
      // GSAP animation for Main Content Fade-In
      gsap.fromTo(
        '.main-content', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
      );
    }, [activeNav]); // Run animations on activeNav change
  
    
  return (
      <div>
      <div className="flex min-h-screen bg-gray-50 pt-[80px] p-4">
        {/* Sidebar */}
        <div className="sidebar w-80 bg-white p-6 shadow-lg">
          <Profile />
          <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />
        </div>
  
        {/* Main Content */}
        <div className="main-content flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      </div>
    );
}

export default PatientDashbord