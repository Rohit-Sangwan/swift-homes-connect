
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/profile/ProfileHeader';
import CustomerQuickActions from '@/components/profile/CustomerQuickActions';
import SettingsList from '@/components/profile/SettingsList';
import WorkerView from '@/components/profile/WorkerView';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isWorker, setIsWorker] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsLoggedIn(true);
        setUser(data.session.user);
        // Check if user is admin
        if (data.session.user?.app_metadata?.role === 'admin') {
          setIsAdmin(true);
        }
      } else {
        // Redirect to login page if not logged in
        navigate('/auth');
      }
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth');
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="Profile">
      <div className="p-4">
        {/* Profile Header */}
        <ProfileHeader 
          isLoggedIn={isLoggedIn} 
          user={user} 
          isAdmin={isAdmin} 
        />
        
        {/* Account Type Toggle */}
        <Tabs defaultValue="customer" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" onClick={() => setIsWorker(false)}>Customer</TabsTrigger>
            <TabsTrigger value="worker" onClick={() => setIsWorker(true)}>Worker</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Customer View */}
        {!isWorker ? (
          <>
            <CustomerQuickActions />
            <SettingsList 
              isAdmin={isAdmin} 
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
            />
          </>
        ) : (
          <WorkerView />
        )}
      </div>
      <BottomNavigation />
    </PageContainer>
  );
};

export default ProfilePage;
