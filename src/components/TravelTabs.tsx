import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const TravelTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
  { label: "Hotel", icon: "🏨", path: "/hotels" },
  { label: "Flight", icon: "✈️", path: "/flights" },
  { label: "Car Rentals", icon: "🚗", path: "/car-rentals" },
  { label: "Travel Packages", icon: "📦", path: "/packages" }];


  const isActive = (path: string) => {
    return location.pathname === path ||
    path === "/hotels" && location.pathname === "/" ||
    location.pathname.startsWith(path);
  };

  return (
    <div className="grid grid-cols-4 gap-2" data-id="mkz60sope" data-path="src/components/TravelTabs.tsx">
      {tabs.map((tab) =>
      <button
        key={tab.path}
        className={cn(
          "flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-colors",
          isActive(tab.path) ?
          "bg-aerotrav-blue text-white" :
          "bg-gray-100 hover:bg-gray-200 text-gray-800"
        )}
        onClick={() => navigate(tab.path)} data-id="8y7onpu4h" data-path="src/components/TravelTabs.tsx">

          <span className="text-lg mb-1" data-id="wx7vk54nb" data-path="src/components/TravelTabs.tsx">{tab.icon}</span>
          <span className="text-sm" data-id="94kee3wuk" data-path="src/components/TravelTabs.tsx">{tab.label}</span>
        </button>
      )}
    </div>);

};

export default TravelTabs;