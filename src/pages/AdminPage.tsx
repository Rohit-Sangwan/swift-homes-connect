import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ServiceProviderTable from '@/components/admin/ServiceProviderTable';
import EmptyState from '@/components/admin/EmptyState';
import StatusBadge from '@/components/admin/StatusBadge';

interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  city: string;
  service_category: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    checkAdminStatus();
    fetchProviders();
  }, []);
  
  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      console.log("Current session data:", data);
      
      if (data.session) {
        const { user } = data.session;
        console.log("User metadata:", user?.app_metadata);
        console.log("User email:", user?.email);
        
        // Check if user is the admin by checking both metadata and email
        if (user?.app_metadata?.role === 'admin' || 
            user?.email?.toLowerCase() === 'nullcoder404official@gmail.com') {
          console.log("Admin status granted");
          setIsAdmin(true);
          
          // Ensure admin metadata is set
          if (user?.app_metadata?.role !== 'admin') {
            await supabase.auth.updateUser({
              data: { role: 'admin' }
            });
            console.log("Updated user metadata with admin role");
          }
        } else {
          // Not an admin, redirect to home
          console.log("Not an admin, redirecting to home");
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel.",
            variant: "destructive",
          });
        }
      } else {
        // Not logged in, redirect to login
        console.log("Not logged in, redirecting to auth");
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
    }
  };
  
  const fetchProviders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service provider data.",
        variant: "destructive",
      });
    } else {
      // Type assertion to ensure the status is properly typed
      const typedData = (data || []).map(provider => ({
        ...provider,
        status: provider.status as 'pending' | 'approved' | 'rejected'
      }));
      setProviders(typedData);
    }
    setLoading(false);
  };
  
  const updateProviderStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('service_providers')
      .update({ status })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status.",
        variant: "destructive",
      });
    } else {
      // Update local state
      setProviders(providers.map(provider => 
        provider.id === id ? {...provider, status} : provider
      ));
      
      toast({
        title: "Success",
        description: `Provider ${status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
    }
  };
  
  const filterProviders = (status: string) => {
    if (status === 'all') return providers;
    return providers.filter(provider => provider.status === status);
  };
  
  if (loading) {
    return (
      <PageContainer title="Admin Panel">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in checkAdminStatus
  }
  
  return (
    <PageContainer title="Admin Panel">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Service Provider Applications</h1>
        
        <Tabs defaultValue="pending" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          {['pending', 'approved', 'rejected'].map(status => (
            <TabsContent key={status} value={status}>
              {filterProviders(status).length > 0 ? (
                <ServiceProviderTable 
                  providers={filterProviders(status)} 
                  updateProviderStatus={updateProviderStatus}
                  getStatusBadge={(status) => <StatusBadge status={status} />}
                />
              ) : (
                <EmptyState status={status} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
