import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ServiceNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const services = [
  {
    label: 'Hotel',
    icon:
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="1snlbf1x0" data-path="src/components/ServiceNavigation.tsx">
          <path d="M3 14h18v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7z" data-id="r57v8gt79" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M12 4a4 4 0 0 0-4 4v6h8V8a4 4 0 0 0-4-4z" data-id="nd8ixzj2a" data-path="src/components/ServiceNavigation.tsx" />
          <line x1="6" y1="14" x2="6" y2="14" data-id="e9om2fz7o" data-path="src/components/ServiceNavigation.tsx" />
          <line x1="18" y1="14" x2="18" y2="14" data-id="sdny7e7un" data-path="src/components/ServiceNavigation.tsx" />
        </svg>,

    path: '/hotels'
  },
  {
    label: 'Flight',
    icon:
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="wcd4fws0e" data-path="src/components/ServiceNavigation.tsx">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" data-id="w1kts43sj" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M15 3.93l6 6.07-6 6" data-id="w6css0wi7" data-path="src/components/ServiceNavigation.tsx" />
        </svg>,

    path: '/flights'
  },
  {
    label: 'Car Rentals',
    icon:
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="d3qat8yl6" data-path="src/components/ServiceNavigation.tsx">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10.2c-.4-.2-.8-.3-1.3-.3H8.5c-.5 0-1 .1-1.4.4L3.8 12c-.6.3-1 1-1 1.7V16c0 .6.4 1 1 1h2" data-id="4q0x90kap" data-path="src/components/ServiceNavigation.tsx" />
          <circle cx="7" cy="17" r="2" data-id="8ns8lf6gm" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M9 17h6" data-id="7772pmhyx" data-path="src/components/ServiceNavigation.tsx" />
          <circle cx="17" cy="17" r="2" data-id="pz3z7wwh0" data-path="src/components/ServiceNavigation.tsx" />
        </svg>,

    path: '/car-rentals'
  },
  {
    label: 'Travel Packages',
    icon:
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="imbwnji05" data-path="src/components/ServiceNavigation.tsx">
          <path d="M16 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" data-id="kt6a85lyo" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M12 10h4" data-id="3kgldx5tc" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M12 14h4" data-id="m8gt2x85o" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M8 6h8" data-id="aq1dfwg3r" data-path="src/components/ServiceNavigation.tsx" />
        </svg>,

    path: '/packages'
  },
  {
    label: 'AI Trip Creator',
    icon:
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="vqcd8imzi" data-path="src/components/ServiceNavigation.tsx">
          <path d="M12 2v8" data-id="jt9m88b3s" data-path="src/components/ServiceNavigation.tsx" />
          <path d="m4.93 10.93 1.41 1.41" data-id="ylysl3fyg" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M2 18h2" data-id="8dzdo1jmh" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M20 18h2" data-id="615g73gbh" data-path="src/components/ServiceNavigation.tsx" />
          <path d="m19.07 10.93-1.41 1.41" data-id="4vfd9m2ga" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M22 22H2" data-id="r2u2i1mug" data-path="src/components/ServiceNavigation.tsx" />
          <path d="m16 6-4 4-4-4" data-id="wulv25i2k" data-path="src/components/ServiceNavigation.tsx" />
          <path d="M16 18a4 4 0 0 0-8 0" data-id="mpjq50ydj" data-path="src/components/ServiceNavigation.tsx" />
        </svg>,

    path: '/trip-creator'
  }];


  const isActive = (path: string) => {
    return location.pathname === path ||
    path === '/hotels' && location.pathname === '/' ||
    location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white p-4 shadow-sm rounded-lg" data-id="uzobxiqzl" data-path="src/components/ServiceNavigation.tsx">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2" data-id="6z16ega0i" data-path="src/components/ServiceNavigation.tsx">
        {services.map((service) =>
        <button
          key={service.path}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-lg transition-colors",
            isActive(service.path) ?
            "bg-aerotrav-blue text-white" :
            "bg-gray-100 hover:bg-gray-200 text-gray-800"
          )}
          onClick={() => navigate(service.path)} data-id="o79s0i3la" data-path="src/components/ServiceNavigation.tsx">

            <span className="text-lg mb-2" data-id="yxfvx0siw" data-path="src/components/ServiceNavigation.tsx">{service.icon}</span>
            <span className="text-sm font-medium" data-id="e2jvh9b2w" data-path="src/components/ServiceNavigation.tsx">{service.label}</span>
          </button>
        )}
      </div>
    </div>);

};

export default ServiceNavigation;