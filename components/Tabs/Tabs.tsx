"use client";

import React, { useState } from "react";
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
  // Controlled-uncontrolled hybrid: prefer user selection, otherwise defaultActive, otherwise first tab.
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected ?? defaultActive ?? (tabs[0]?.value || "");

  const handleClick = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  // If no tabs, render nothing or fallback
  if (!tabs || tabs.length === 0) {
    return <p className="text-center text-gray-500 py-8">No tabs available</p>;
  }

  return (
    <div className="w-full ">
      {/* Tabs Navigation */}
      {/* Make rings/shadows visible at edges by giving extra padding; keep horizontal scroll when needed */}
      <div
        className="flex gap-3 md:gap-4 py-4 pl-8 pr-3 md:pl-10 md:pr-4 overflow-x-auto scrollbar-hide "
        role="tablist"
      >
        {tabs.map((tab) => (
          <CustomButton
            key={tab.value}
            text={tab.label}
            onClick={() => handleClick(tab.value)}
            variant={active === tab.value ? "primary" : "transparent"}
            className={`whitespace-nowrap rounded-full  text-sm md:text-base font-medium transition-all duration-200 px-5 py-2.5 shadow-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 `}
          />
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="w-full mt-8 ">
        {tabs.find((tab) => tab.value === active)?.component ?? null}
      </div>
    </div>
  );
};

export default Tabs;
