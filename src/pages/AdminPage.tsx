
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceProviderTable from '@/components/admin/ServiceProviderTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import CategoryManager from '@/components/admin/CategoryManager';
import { Users, Settings, BarChart, Database, UserCog, FolderTree } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('applications');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    providers: 0,
    categories: 0,
    pending: 0
  });
  
  useEffect(() => {
    checkAdminStatus();
    fetchDashboardStats();
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
  
  const fetchDashboardStats = async () => {
    try {
      const { data: providers, error: providersError } = await supabase
        .from('service_providers')
        .select('status')
        .eq('status', 'approved');
      
      const { data: pendingProviders, error: pendingError } = await supabase
        .from('service_providers')
        .select('status')
        .eq('status', 'pending');
      
      const { data: categories, error: categoriesError } = await supabase
        .from('service_categories')
        .select('id');
        
      if (!providersError && !pendingError && !categoriesError) {
        setStats({
          providers: providers?.length || 0,
          categories: categories?.length || 0,
          pending: pendingProviders?.length || 0
        });
      }
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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
        {/* Dashboard Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.providers}</p>
              <p className="text-xs uppercase tracking-wider opacity-80">Providers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <FolderTree className="h-8 w-8 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.categories}</p>
              <p className="text-xs uppercase tracking-wider opacity-80">Categories</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <BarChart className="h-8 w-8 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs uppercase tracking-wider opacity-80">Pending</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Service Provider Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceProviderTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories" className="animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Manage Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">System Configuration</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Configure system-wide settings and preferences
                  </p>
                  <Button variant="outline" className="w-full">
                    <Settings size={16} className="mr-2" /> System Settings
                  </Button>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Database Management</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Perform database maintenance operations
                  </p>
                  <Button variant="outline" className="w-full">
                    <Database size={16} className="mr-2" /> Database Options
                  </Button>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">User Management</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Manage user accounts and permissions
                  </p>
                  <Button variant="outline" className="w-full">
                    <UserCog size={16} className="mr-2" /> Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
