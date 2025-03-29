import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Connecting Healthcare
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Bridging the gap between patients and healthcare professionals
            through innovative technology
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mb-24 items-center">
          <div className="flex-1 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80"
                alt="Digital Healthcare"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're revolutionizing healthcare access by creating a seamless
                connection between patients and qualified healthcare
                professionals Through Video and In-person Consultaion. Our
                platform enables secure video consultations, making quality
                healthcare accessible to everyone, anywhere.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-600 text-white rounded-xl p-6 transform hover:scale-105 transition-all">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-lg">Available for Help</div>
              </div>
              <div className="bg-blue-600 text-white rounded-xl p-6 transform hover:scale-105 transition-all">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-lg">Secure Platform</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Verified Doctors
            </h3>
            <p className="text-gray-600">
              All healthcare professionals on our platform are thoroughly
              verified and credentialed.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Book An Appointemnt
            </h3>
            <p className="text-gray-600">
              Connect with doctors through Book Online or Offline Appointments.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Secure Consultations
            </h3>
            <p className="text-gray-600">
              End-to-end encrypted video consultations ensuring your privacy and
              confidentiality.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Connect with a Doctor?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust our platform for their
            healthcare needs.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
