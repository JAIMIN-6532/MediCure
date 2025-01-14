import React from 'react';
import { Stethoscope } from 'lucide-react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 pt-[80px] ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

// AuthLayout.js
// import React from 'react';

// const AuthLayout = ({ title, children }) => {
//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-2xl font-semibold text-center mb-8">{title}</h1>
//       {children}
//     </div>
//   );
// };

// export default AuthLayout;
