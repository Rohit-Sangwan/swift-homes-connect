
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  className?: string;
}

const locations = [
  "San Francisco, CA",
  "New Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Hyderabad, India",
  "Chennai, India",
  "Kolkata, India"
];

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack = false, 
  transparent = false,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState("San Francisco, CA");
  
  const handleBack = () => {
    if (location.pathname === "/") {
      return;
    }
    navigate(-1);
  };

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-10 w-full h-16 flex items-center justify-between px-4",
        transparent ? "bg-transparent" : "bg-white border-b border-gray-100",
        className
      )}
    >
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}
        {title && <h1 className="font-semibold text-lg">{title}</h1>}
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded">
              <MapPin size={16} className="text-brand-blue mr-1" />
              <span>{currentLocation}</span>
              <ChevronDown size={14} className="ml-1 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {locations.map((loc) => (
              <DropdownMenuItem 
                key={loc} 
                onClick={() => handleLocationChange(loc)}
                className={currentLocation === loc ? "bg-gray-100 font-medium" : ""}
              >
                {loc}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="p-2 rounded-full hover:bg-gray-100 ml-2">
          <Bell size={20} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
