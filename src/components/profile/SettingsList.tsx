
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Settings, LogOut, ChevronRight, Shield } from 'lucide-react';

interface SettingsListProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
  handleLogout: () => Promise<void>;
}

const SettingsList: React.FC<SettingsListProps> = ({ isAdmin, isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl overflow-hidden card-shadow">
      {isAdmin && (
        <div 
          className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer"
          onClick={() => navigate('/admin')}
        >
          <Shield size={18} className="text-brand-blue mr-3" />
          <span className="font-medium text-brand-blue">Admin Panel</span>
          <ChevronRight size={18} className="text-gray-400 ml-auto" />
        </div>
      )}
      <div 
        className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer"
        onClick={() => navigate('/account-settings')}
      >
        <User size={18} className="text-gray-500 mr-3" />
        <span>Account Settings</span>
        <ChevronRight size={18} className="text-gray-400 ml-auto" />
      </div>
      <div 
        className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer"
        onClick={() => navigate('/notifications')}
      >
        <Bell size={18} className="text-gray-500 mr-3" />
        <span>Notifications</span>
        <ChevronRight size={18} className="text-gray-400 ml-auto" />
      </div>
      <div 
        className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer"
        onClick={() => navigate('/app-settings')}
      >
        <Settings size={18} className="text-gray-500 mr-3" />
        <span>App Settings</span>
        <ChevronRight size={18} className="text-gray-400 ml-auto" />
      </div>
      <div 
        className="flex items-center px-4 py-3 cursor-pointer"
        onClick={isLoggedIn ? handleLogout : () => navigate('/auth')}
      >
        <LogOut size={18} className="text-red-500 mr-3" />
        <span className="text-red-500">{isLoggedIn ? "Logout" : "Login"}</span>
      </div>
    </div>
  );
};

export default SettingsList;
