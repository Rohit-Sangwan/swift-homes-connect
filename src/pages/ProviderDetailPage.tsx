
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  service_category: string;
  experience: string;
  price_range: string;
  about: string;
  profile_image_url?: string;
  id_proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const ProviderDetailPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    checkAdminStatus();
    fetchProviderDetails();
  }, [providerId]);
  
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
  };
  
  const fetchProviderDetails = async () => {
    if (!providerId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .eq('id', providerId)
      .single();
      
    if (error) {
      console.error('Error fetching provider details:', error);
      toast({
        title: "Error",
        description: "Failed to load provider details.",
        variant: "destructive",
      });
    } else if (data) {
      // Type assertion to ensure the status is properly typed
      setProvider({
        ...data,
        status: data.status as 'pending' | 'approved' | 'rejected'
      });
    }
    setLoading(false);
  };
  
  const updateProviderStatus = async (status: 'approved' | 'rejected') => {
    if (!provider) return;
    
    const { error } = await supabase
      .from('service_providers')
      .update({ status })
      .eq('id', provider.id);
      
    if (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status.",
        variant: "destructive",
      });
    } else {
      setProvider({...provider, status});
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
  
  if (loading) {
    return (
      <PageContainer title="Provider Details" showBack>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!isAdmin || !provider) {
    return null; // Will redirect in checkAdminStatus
  }
  
  return (
    <PageContainer title="Provider Details" showBack>
      <div className="p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <div>
                <CardTitle className="text-xl">{provider.name}</CardTitle>
                <CardDescription>{provider.service_category}</CardDescription>
              </div>
              {getStatusBadge(provider.status)}
            </div>
            
            <div className="flex items-center mt-4">
              {provider.profile_image_url ? (
                <img 
                  src={provider.profile_image_url} 
                  alt={provider.name} 
                  className="w-20 h-20 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Experience: {provider.experience}</p>
                <p className="text-sm font-medium">Price Range: {provider.price_range}</p>
                <p className="text-sm font-medium">City: {provider.city}</p>
                <p className="text-sm text-gray-500">Applied on: {new Date(provider.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-sm font-medium mb-2">Contact Information</h3>
            <p className="text-sm mb-4">
              Phone: {provider.phone}<br />
              Address: {provider.address}, {provider.city}
            </p>
            
            <h3 className="text-sm font-medium mb-2">About</h3>
            <p className="text-sm whitespace-pre-line mb-6">{provider.about}</p>
            
            <h3 className="text-sm font-medium mb-2">ID Proof</h3>
            {provider.id_proof_url ? (
              <div className="mb-4">
                <img 
                  src={provider.id_proof_url} 
                  alt="ID Proof" 
                  className="max-w-full h-auto rounded-md border"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No ID proof uploaded</p>
            )}
          </CardContent>
          {provider.status === 'pending' && (
            <CardFooter className="flex justify-end gap-3">
              <Button
                variant="outline" 
                className="bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => updateProviderStatus('rejected')}
              >
                Reject Application
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => updateProviderStatus('approved')}
              >
                Approve Application
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Button variant="outline" onClick={() => navigate('/admin')}>
          Back to Applications
        </Button>
      </div>
    </PageContainer>
  );
};

export default ProviderDetailPage;
