
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  isLoggedIn: boolean;
  user: any;
  isAdmin: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isLoggedIn, user, isAdmin }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
        <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h2 className="font-semibold">
          {isLoggedIn ? (user?.email || "Logged In User") : "Guest User"}
        </h2>
        <p className="text-sm text-gray-500">
          {isLoggedIn 
            ? isAdmin 
              ? "Admin Account" 
              : "User Account" 
            : "Add your details to personalize your experience"}
        </p>
        <p className="text-xs text-gray-500 flex items-center mt-1">
          <MapPin size={12} className="mr-1" /> New Delhi, India
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/account-settings')}
        className="rounded-full hover:bg-brand-blue hover:text-white border-brand-blue text-brand-blue transition-colors"
      >
        Edit
      </Button>
    </div>
  );
};

export default ProfileHeader;
