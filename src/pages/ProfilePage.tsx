
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, Settings, Star, Clock, LogOut, ChevronRight, Bell, Phone } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  const [isWorker, setIsWorker] = React.useState(false);
  
  return (
    <PageContainer title="Profile">
      <div className="p-4">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
            <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Guest User</h2>
            <p className="text-sm text-gray-500">Add your details to personalize your experience</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/edit-profile')}>
            Edit
          </Button>
        </div>
        
        {/* Account Type Toggle */}
        <Tabs defaultValue="customer" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" onClick={() => setIsWorker(false)}>Customer</TabsTrigger>
            <TabsTrigger value="worker" onClick={() => setIsWorker(true)}>Worker</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Customer View */}
        {!isWorker && (
          <>
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 mb-6 card-shadow">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-blue-50 text-brand-blue mb-1">
                    <Star size={20} />
                  </Button>
                  <span className="text-xs">Favorites</span>
                </div>
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-orange-50 text-brand-orange mb-1">
                    <Clock size={20} />
                  </Button>
                  <span className="text-xs">History</span>
                </div>
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-green-50 text-green-600 mb-1">
                    <Phone size={20} />
                  </Button>
                  <span className="text-xs">Support</span>
                </div>
              </div>
            </div>
            
            {/* Settings List */}
            <div className="bg-white rounded-xl overflow-hidden card-shadow">
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
                onClick={() => alert('Logged out successfully!')}
              >
                <LogOut size={18} className="text-red-500 mr-3" />
                <span className="text-red-500">Logout</span>
              </div>
            </div>
          </>
        )}
        
        {/* Worker View */}
        {isWorker && (
          <div className="space-y-6">
            <div className="bg-brand-blue/10 border-2 border-brand-blue/20 rounded-xl p-4 text-center">
              <h3 className="font-medium mb-2">Become a Service Provider</h3>
              <p className="text-sm text-gray-600 mb-3">
                List your services and start getting job requests from customers in your area.
              </p>
              <Button 
                className="bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => navigate('/become-provider')}
              >
                Register as Provider
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-4 card-shadow">
              <h3 className="font-medium mb-3">Benefits of being a Service Provider</h3>
              <div className="space-y-3">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
                  <div>
                    <h4 className="text-sm font-medium">Find Local Customers</h4>
                    <p className="text-xs text-gray-500">Connect with customers in your area</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
                  <div>
                    <h4 className="text-sm font-medium">Direct Communication</h4>
                    <p className="text-xs text-gray-500">Talk directly with customers via phone</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
                  <div>
                    <h4 className="text-sm font-medium">Build Reputation</h4>
                    <p className="text-xs text-gray-500">Earn reviews and ratings for your work</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
                  <div>
                    <h4 className="text-sm font-medium">Free Registration</h4>
                    <p className="text-xs text-gray-500">No fees to list your services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
