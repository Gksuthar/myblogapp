"use client";

import React, { useEffect, useState } from "react";
import CustomButton from "../ui/customButtom/Button";

interface Tab {
  label: string;
  value: string;
  component?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  onChange?: (value: string) => void;
  defaultActive?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs = [], onChange, defaultActive }) => {
  const [active, setActive] = useState<string>("");

  // Initialize active tab safely
  useEffect(() => {
    if (tabs.length > 0) {
      setActive(defaultActive || tabs[0].value);
    }
  }, [tabs, defaultActive]);

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  // If no tabs, render nothing or fallback
  if (!tabs || tabs.length === 0) {
    return <p className="text-center text-gray-500 py-8">No tabs available</p>;
  }

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div
        className="flex overflow-x-auto scrollbar-hide gap-3 md:gap-4 py-4 px-1 md:px-0"
        role="tablist"
      >
        {tabs.map((tab) => (
          <CustomButton
            key={tab.value}
            text={tab.label}
            onClick={() => handleClick(tab.value)}
            variant={active === tab.value ? "dark" : "transparent"}
            className={`whitespace-nowrap rounded-full text-sm md:text-base font-medium transition-all duration-200 px-5 py-2.5 shadow-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              active === tab.value
                ? "bg-gray-900 text-white"
                : "text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          />
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="w-full mt-8">
        {tabs.find((tab) => tab.value === active)?.component ?? null}
      </div>
    </div>
  );
};

export default Tabs;
