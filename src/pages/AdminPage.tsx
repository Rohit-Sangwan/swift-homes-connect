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
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, BarChart2, Settings, FileText, 
  Bell, Database, DollarSign, Shield,
  UserPlus, Search, Filter, Eye, Ban, Trash2,
  Award, MapPin, Star, AlertTriangle, Clock,
  ChevronRight, RefreshCw
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
  last_sign_in_at: string | null;
  role?: string;
  status: 'active' | 'blocked';
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('providers');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Add this to force refreshes
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalProviders: 0,
    pendingApprovals: 0,
    totalServices: 0
  });
  
  useEffect(() => {
    checkAdminStatus();
  }, []);
  
  useEffect(() => {
    if (isAdmin) {
      if (activeSection === 'providers') {
        fetchProviders();
      } else if (activeSection === 'users') {
        fetchUsers();
      } else if (activeSection === 'analytics') {
        fetchAnalyticsData();
      }
    }
  }, [isAdmin, activeSection, refreshKey]);
  
  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      console.log("Current session data:", data);
      
      if (data.session) {
        const { user } = data.session;
        console.log("User metadata:", user?.app_metadata);
        console.log("User email:", user?.email);
        
        // Check if user is admin by checking both metadata and email
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
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Type assertion to ensure the status is properly typed
      const typedData = (data || []).map(provider => ({
        ...provider,
        status: provider.status as 'pending' | 'approved' | 'rejected'
      }));
      
      console.log("Fetched providers:", typedData);
      console.log("Approved providers:", typedData.filter(p => p.status === 'approved').length);
      
      setProviders(typedData);
      toast({
        title: "Data Loaded",
        description: `Loaded ${typedData.length} service providers.`,
      });
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service provider data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Since we can't access auth.admin.listUsers with the anon key,
      // we'll get users from service_providers and current session instead
      const { data: currentUserData } = await supabase.auth.getUser();
      const currentUser = currentUserData?.user;
      
      // Start with the current user (admin)
      const usersList: User[] = [];
      
      if (currentUser) {
        usersList.push({
          id: currentUser.id,
          email: currentUser.email || 'admin@example.com',
          created_at: currentUser.created_at || new Date().toISOString(),
          last_sign_in_at: currentUser.last_sign_in_at,
          role: 'admin',
          status: 'active' as 'active' | 'blocked'
        });
      }
      
      // Get provider users from service_providers table
      const { data: providersData, error: providersError } = await supabase
        .from('service_providers')
        .select('user_id, name, created_at')
        .not('user_id', 'is', null);
        
      if (providersError) {
        throw providersError;
      }
      
      // Convert provider data to users
      if (providersData) {
        const providerUsers = providersData.map(provider => ({
          id: provider.user_id,
          email: `${provider.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Create email based on name
          created_at: provider.created_at || new Date().toISOString(),
          last_sign_in_at: null,
          role: 'provider',
          status: 'active' as 'active' | 'blocked'
        }));
        
        // Add provider users to the list, avoiding duplicates
        providerUsers.forEach(user => {
          if (!usersList.some(existingUser => existingUser.id === user.id)) {
            usersList.push(user);
          }
        });
      }
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Using available data instead.",
        variant: "destructive",
      });
      
      // Fallback to minimal user data
      const { data: currentUserData } = await supabase.auth.getUser();
      if (currentUserData?.user) {
        setUsers([{
          id: currentUserData.user.id,
          email: currentUserData.user.email || 'admin@example.com',
          created_at: currentUserData.user.created_at || new Date().toISOString(),
          last_sign_in_at: currentUserData.user.last_sign_in_at,
          role: 'admin',
          status: 'active' as 'active' | 'blocked'
        }]);
      }
    }
    setLoading(false);
  };

  const fetchAnalyticsData = async () => {
    try {
      // Get counts from actual Supabase data
      const [providersResponse, pendingResponse, servicesResponse] = await Promise.all([
        // Count approved providers
        supabase
          .from('service_providers')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'approved'),
          
        // Count pending providers  
        supabase
          .from('service_providers')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
          
        // Get distinct service categories
        supabase
          .from('service_providers')
          .select('service_category')
          .not('service_category', 'is', null)
      ]);
      
      // Get unique categories
      const uniqueCategories = [...new Set((servicesResponse.data || []).map(p => p.service_category))];
      
      // Calculate total users - will be at least 1 (the admin)
      const totalUsers = users.length > 0 ? users.length : 1;
      
      setAnalyticsData({
        totalUsers,
        totalProviders: providersResponse.count || 0,
        pendingApprovals: pendingResponse.count || 0,
        totalServices: uniqueCategories.length || 0
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };
  
  const updateProviderStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ status })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setProviders(providers.map(provider => 
        provider.id === id ? {...provider, status} : provider
      ));
      
      // Refresh data
      setRefreshKey(prev => prev + 1);
      
      toast({
        title: "Success",
        description: `Provider ${status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status.",
        variant: "destructive",
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
    } else if (section === 'analytics') {
      fetchAnalyticsData();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.service_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading && activeSection === 'providers') {
    return (
      <PageContainer title="Admin Panel">
        <div className="flex justify-center items-center h-64">
          <p>Loading service provider data...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!isAdmin) {
    return (
      <PageContainer title="Admin Panel">
        <div className="flex justify-center items-center h-64">
          <p>Verifying admin permissions...</p>
        </div>
      </PageContainer>
    );
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
                  <span>Analytics & Insights</span>
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
        
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
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
            
            {/* Global search bar */}
            <div className="mb-6 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10" 
                  placeholder={`Search ${activeSection}...`} 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (activeSection === 'providers') fetchProviders();
                  else if (activeSection === 'users') fetchUsers();
                  else if (activeSection === 'analytics') fetchAnalyticsData();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            {activeSection === 'providers' && (
              <Tabs defaultValue="pending" className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="pending">Pending ({filterProviders('pending').length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({filterProviders('approved').length})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({filterProviders('rejected').length})</TabsTrigger>
                </TabsList>
                
                {['pending', 'approved', 'rejected'].map(status => (
                  <TabsContent key={status} value={status}>
                    {filterProviders(status).length > 0 ? (
                      <ServiceProviderTable 
                        providers={searchTerm ? filteredProviders.filter(p => p.status === status) : filterProviders(status)} 
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchUsers}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add User
                    </Button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading users...</p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                              }`}>
                                {user.role || 'User'}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {user.last_sign_in_at 
                                ? new Date(user.last_sign_in_at).toLocaleDateString() 
                                : 'Never'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </TableCell>
                            <TableCell className="space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Ban className="h-4 w-4" />
                              </Button>
                              {user.email !== 'nullcoder404official@gmail.com' && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No users found. Try refreshing the list.
                  </div>
                )}
              </div>
            )}
            
            {activeSection === 'analytics' && (
              <div className="space-y-6">
                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                      <p className="text-xs text-green-500 mt-1">
                        {analyticsData.totalUsers > 0 ? "Active user accounts" : "No users yet"}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Active Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.totalProviders}</div>
                      <p className="text-xs text-green-500 mt-1">
                        {analyticsData.totalProviders > 0 ? "Approved providers" : "No providers yet"}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.pendingApprovals}</div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs text-amber-500">
                          {analyticsData.pendingApprovals > 0 
                            ? "Requires attention" 
                            : "No pending approvals"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Service Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.totalServices}</div>
                      <p className="text-xs text-blue-500 mt-1">
                        {analyticsData.totalServices > 0 
                          ? "Active service categories" 
                          : "No categories yet"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {providers.length > 0 ? (
                      <div className="space-y-4">
                        {providers.slice(0, 5).map((provider, index) => (
                          <div key={provider.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <Users className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{provider.name}</p>
                                <p className="text-xs text-gray-500">
                                  {provider.status === 'pending' ? 'Applied to be a provider' : 
                                   provider.status === 'approved' ? 'Was approved as a provider' : 
                                   'Was rejected as a provider'}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(provider.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No recent activity to display.
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Top Rated Providers */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Active Providers</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>View All</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {providers.filter(provider => provider.status === 'approved').length > 0 ? (
                      <div className="space-y-4">
                        {providers
                          .filter(provider => provider.status === 'approved')
                          .slice(0, 3)
                          .map((provider) => (
                            <div key={provider.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-semibold">{provider.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{provider.name}</p>
                                  <div className="flex items-center">
                                    <span className="text-xs mr-2">{provider.service_category}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {provider.city}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No approved providers yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'content' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Manage service categories displayed on the platform</p>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Providers</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {providers.length > 0 ? (
                            [...new Set(providers.map(p => p.service_category))].map((category, i) => {
                              const providersInCategory = providers.filter(p => p.service_category === category).length;
                              return (
                                <TableRow key={i}>
                                  <TableCell className="font-medium">{category}</TableCell>
                                  <TableCell>{providersInCategory}</TableCell>
                                  <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      Active
                                    </span>
                                  </TableCell>
                                  <TableCell className="space-x-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No categories available. Add service providers to create categories.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Providers Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Configure which providers appear in the featured section</p>
                        <Button size="sm">Update Featured</Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Provider</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {providers.filter(provider => provider.status === 'approved').length > 0 ? (
                            providers
                              .filter(provider => provider.status === 'approved')
                              .slice(0, 5)
                              .map((provider, i) => (
                                <TableRow key={provider.id}>
                                  <TableCell className="font-medium">{provider.name}</TableCell>
                                  <TableCell>{provider.service_category}</TableCell>
                                  <TableCell>{provider.city}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      i < 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {i < 3 ? 'Featured' : 'Not Featured'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="space-x-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      {i < 3 ? (
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      ) : (
                                        <Star className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                No approved providers to feature.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Recipient Type</label>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">All Users</Button>
                          <Button variant="outline" className="flex-1">Providers Only</Button>
                          <Button variant="outline" className="flex-1">Customers Only</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message Title</label>
                        <Input placeholder="Enter notification title" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message Content</label>
                        <Input className="h-24" placeholder="Enter notification message" />
                      </div>
                      
                      <Button className="w-full">Send Notification</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notification History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      No notification history available. Send your first notification using the form above.
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'monetization' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$0</div>
                      <p className="text-xs text-gray-500 mt-1">No revenue data available</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Premium Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-gray-500 mt-1">No subscriptions yet</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Featured Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-gray-500 mt-1">No featured listings yet</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Manage subscription plans for service providers</p>
                        <Button size="sm">Add New Plan</Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Plan</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Features</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { name: 'Basic', price: 'Free', features: '3 basic features', active: true },
                            { name: 'Standard', price: '$29/mo', features: '10 features + priority listing', active: true },
                            { name: 'Premium', price: '$99/mo', features: 'All features + featured placement', active: true },
                          ].map((plan, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{plan.name}</TableCell>
                              <TableCell>{plan.price}</TableCell>
                              <TableCell>{plan.features}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  plan.active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {plan.active ? 'Active' : 'Draft'}
                                </span>
                              </TableCell>
                              <TableCell className="space-x-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      No transaction history available.
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'data' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Database Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Service Providers</p>
                          <span className="text-sm">{providers.length} records</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Users</p>
                          <span className="text-sm">{users.length} records</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Categories</p>
                          <span className="text-sm">{analyticsData.totalServices} records</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Reviews</p>
                          <span className="text-sm">0 records</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Last Backup</p>
                          <span className="text-sm text-gray-500">No backups yet</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Operations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full justify-start" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Run Backup
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Database className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Filter className="h-4 w-4 mr-2" />
                          Clean Database
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Database Tables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Table Name</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>service_providers</TableCell>
                            <TableCell>{providers.length}</TableCell>
                            <TableCell>
                              {providers.length > 0 
                                ? new Date(Math.max(...providers.map(p => new Date(p.created_at).getTime()))).toLocaleDateString() 
                                : 'No data'}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>users</TableCell>
                            <TableCell>{users.length}</TableCell>
                            <TableCell>
                              {users.length > 0
                                ? new Date(Math.max(...users.map(u => new Date(u.created_at).getTime()))).toLocaleDateString()
                                : 'No data'}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>reviews</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>No data</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                          <p className="font-medium">User Registration</p>
                          <p className="text-sm text-gray-500">Allow new users to register</p>
                        </div>
                        <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">Enabled</Button>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                          <p className="font-medium">Provider Applications</p>
                          <p className="text-sm text-gray-500">Allow new service provider applications</p>
                        </div>
                        <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">Enabled</Button>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                          <p className="font-medium">Automatic Approvals</p>
                          <p className="text-sm text-gray-500">Automatically approve verified providers</p>
                        </div>
                        <Button variant="outline">Disabled</Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Send email notifications to users</p>
                        </div>
                        <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">Enabled</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys & Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Mapbox API Key</label>
                        <div className="flex gap-2">
                          <Input type="password" value="•••••••••••••••••••••••••••••" disabled className="flex-1" />
                          <Button variant="outline">Reveal</Button>
                          <Button variant="outline">Update</Button>
                        </div>
                        <p className="text-xs text-gray-500">Used for location services and map display</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Server Settings</label>
                        <div className="flex gap-2">
                          <Input placeholder="Not configured" disabled className="flex-1" />
                          <Button variant="outline">Configure</Button>
                        </div>
                        <p className="text-xs text-gray-500">Required for sending email notifications</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Gateway API Key</label>
                        <div className="flex gap-2">
                          <Input placeholder="Not configured" disabled className="flex-1" />
                          <Button variant="outline">Configure</Button>
                        </div>
                        <p className="text-xs text-gray-500">Required for processing payments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
