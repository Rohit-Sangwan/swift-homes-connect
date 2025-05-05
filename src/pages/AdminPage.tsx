import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

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
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { user } = data.session;
      if (user?.app_metadata?.role === 'admin') {
        setIsAdmin(true);
      } else {
        // Not an admin, redirect to home
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterProviders(status).map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell className="font-medium">{provider.name}</TableCell>
                          <TableCell>{provider.service_category}</TableCell>
                          <TableCell>{provider.city}</TableCell>
                          <TableCell>{provider.experience}</TableCell>
                          <TableCell>{getStatusBadge(provider.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/admin/providers/${provider.id}`)}
                              >
                                View
                              </Button>
                              {provider.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline" 
                                    size="sm"
                                    className="bg-green-100 text-green-800 hover:bg-green-200"
                                    onClick={() => updateProviderStatus(provider.id, 'approved')}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline" 
                                    size="sm"
                                    className="bg-red-100 text-red-800 hover:bg-red-200"
                                    onClick={() => updateProviderStatus(provider.id, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No {status} applications found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
