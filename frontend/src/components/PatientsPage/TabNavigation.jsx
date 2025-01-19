import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [ 'Reviews', 'Business Hours'];

  return (
    <div className="border-b border-gray-200 mt-8">
      <nav className="flex w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-8 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;