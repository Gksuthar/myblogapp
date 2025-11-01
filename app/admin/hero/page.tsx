'use client';
import React, { useState } from 'react';
import Home from './home';
import About from './about';
import Blog from './blog';

const tabs = ['Home', 'About', 'Blog'];

export default function Page() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home/>;
      case 'About':
        return <About/>;
      case 'Blog':
        return <Blog/>;
      default:
        return null;
    }
  };

  return (
    <div className=" mx-auto bg-white rounded-xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3 font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>
    </div>
  );
}
