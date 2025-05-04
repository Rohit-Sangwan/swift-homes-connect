
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 bottom-tab-shadow z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
            isActive ? "text-brand-blue" : "text-gray-500 hover:text-gray-900"
          )}
        >
          {({ isActive }) => (
            <>
              <Home size={20} className={isActive ? "fill-brand-blue" : ""} />
              <span className="mt-1">Home</span>
            </>
          )}
        </NavLink>
        
        <NavLink 
          to="/services" 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
            isActive ? "text-brand-blue" : "text-gray-500 hover:text-gray-900"
          )}
        >
          {({ isActive }) => (
            <>
              <Search size={20} className={isActive ? "fill-brand-blue" : ""} />
              <span className="mt-1">Services</span>
            </>
          )}
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
            isActive ? "text-brand-blue" : "text-gray-500 hover:text-gray-900"
          )}
        >
          {({ isActive }) => (
            <>
              <User size={20} className={isActive ? "fill-brand-blue" : ""} />
              <span className="mt-1">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
