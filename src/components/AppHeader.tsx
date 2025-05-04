
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack = false, 
  transparent = false,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    if (location.pathname === "/") {
      return;
    }
    navigate(-1);
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
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
