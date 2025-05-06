
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ServiceProviderTable from '@/components/admin/ServiceProviderTable';
import EmptyState from '@/components/admin/EmptyState';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Users, BarChart2, Settings, FileText, 
  Bell, Database, DollarSign, Shield
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

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

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  role?: string;
  status?: 'active' | 'blocked';
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('providers');
  
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      
      // The actual data might be in a different format based on your Supabase setup
      // Adjust this based on the data structure you receive
      if (data?.users) {
        const formattedUsers = data.users.map(user => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at || '',
          last_sign_in_at: user.last_sign_in_at || '',
          role: user.app_metadata?.role || 'user',
          status: 'active'
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Make sure you have the proper permissions.",
        variant: "destructive",
      });
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

  // Handler for section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    if (section === 'providers') {
      fetchProviders();
    } else if (section === 'users') {
      fetchUsers();
    }
  };
  
  if (loading && activeSection === 'providers') {
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
    <SidebarProvider>
      <div className="h-screen flex overflow-hidden">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-center py-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-brand-blue mr-2" />
              <h2 className="text-lg font-bold">Admin Dashboard</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'providers'} 
                  onClick={() => handleSectionChange('providers')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span>Service Providers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'users'} 
                  onClick={() => handleSectionChange('users')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'analytics'} 
                  onClick={() => handleSectionChange('analytics')}
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'content'} 
                  onClick={() => handleSectionChange('content')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Content Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'notifications'} 
                  onClick={() => handleSectionChange('notifications')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'monetization'} 
                  onClick={() => handleSectionChange('monetization')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Monetization</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'data'} 
                  onClick={() => handleSectionChange('data')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  <span>Data Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === 'settings'} 
                  onClick={() => handleSectionChange('settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
              {activeSection === 'providers' && 'Service Provider Applications'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'analytics' && 'Analytics & Insights'}
              {activeSection === 'content' && 'Content Management'}
              {activeSection === 'notifications' && 'Notification Manager'}
              {activeSection === 'monetization' && 'Monetization & Finance'}
              {activeSection === 'data' && 'Data Management'}
              {activeSection === 'settings' && 'System Settings'}
            </h1>
            
            {activeSection === 'providers' && (
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
            )}
            
            {activeSection === 'users' && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-semibold">User Accounts</h2>
                  <Button variant="outline" size="sm" onClick={fetchUsers}>
                    Refresh List
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading users...</p>
                  </div>
                ) : users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Login</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-t">
                            <td className="px-4 py-3 text-sm">{user.email}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                              }`}>
                                {user.role || 'User'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">
                              {user.last_sign_in_at 
                                ? new Date(user.last_sign_in_at).toLocaleDateString() 
                                : 'Never'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status || 'Active'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm space-x-2">
                              <Button variant="ghost" size="sm">View</Button>
                              {user.email !== 'nullcoder404official@gmail.com' && (
                                <Button variant="destructive" size="sm">Block</Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No users found. Try refreshing the list.
                  </div>
                )}
              </div>
            )}
            
            {activeSection === 'analytics' && (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">Analytics Dashboard</h3>
                <p className="text-gray-400 mt-2">Analytics features are coming soon</p>
              </div>
            )}
            
            {activeSection === 'content' && (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">Content Management</h3>
                <p className="text-gray-400 mt-2">Content management features are coming soon</p>
              </div>
            )}
            
            {activeSection === 'notifications' && (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">Notification Manager</h3>
                <p className="text-gray-400 mt-2">Notification features are coming soon</p>
              </div>
            )}
            
            {activeSection === 'monetization' && (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">Monetization & Finance</h3>
                <p className="text-gray-400 mt-2">Monetization features are coming soon</p>
              </div>
            )}
            
            {activeSection === 'data' && (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">Data Management</h3>
                <p className="text-gray-400 mt-2">Data management features are coming soon</p>
              </div>
            )}
            
            {activeSection === 'settings' && (
              <div className="bg-white p-4 rounded-lg shadow-sm text-center py-16">
                <h3 className="text-lg font-medium text-gray-500">System Settings</h3>
                <p className="text-gray-400 mt-2">Settings features are coming soon</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
