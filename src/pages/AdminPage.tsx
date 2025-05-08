
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ServiceProviderTable from '@/components/admin/ServiceProviderTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CategoryManager from '@/components/admin/CategoryManager';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('applications');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    checkAdminStatus();
  }, []);
  
  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { user } = data.session;
        
        // Check if user is admin (by checking metadata or specific email)
        if (user?.app_metadata?.role === 'admin' || 
            user?.email?.toLowerCase() === 'nullcoder404official@gmail.com') {
          setIsAdmin(true);
          
          // Ensure admin metadata is set
          if (user?.app_metadata?.role !== 'admin') {
            await supabase.auth.updateUser({
              data: { role: 'admin' }
            });
          }
        } else {
          // Not an admin, redirect to home
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
        }
      } else {
        // Not logged in, redirect to login
        navigate('/auth');
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin permissions.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="Admin Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
        </div>
      </PageContainer>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in checkAdminStatus
  }
  
  return (
    <PageContainer title="Admin Dashboard">
      <div className="p-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="animate-fade-in">
            <ServiceProviderTable />
          </TabsContent>
          
          <TabsContent value="categories" className="animate-fade-in">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
