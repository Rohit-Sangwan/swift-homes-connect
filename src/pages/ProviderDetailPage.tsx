
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/admin/StatusBadge';
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
    if (providerId) {
      fetchProviderDetails(providerId);
    }
  }, [providerId]);
  
  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { user } = data.session;
        
        // Check if user is the admin by checking both metadata and email
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
    }
  };
  
  const fetchProviderDetails = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', id)
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
    } catch (error) {
      console.error('Error in provider details:', error);
      toast({
        title: "Error",
        description: "Failed to process provider details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateProviderStatus = async (status: 'approved' | 'rejected') => {
    if (!provider) return;
    
    try {
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
    } catch (error) {
      console.error('Error in status update:', error);
      toast({
        title: "Error",
        description: "Failed to process status update.",
        variant: "destructive",
      });
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
    return (
      <PageContainer title="Provider Details" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-500">{!isAdmin ? "Admin access required" : "Provider not found"}</p>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin Panel
          </Button>
        </div>
      </PageContainer>
    );
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
              <StatusBadge status={provider.status} />
            </div>
            
            <div className="flex items-center mt-4">
              {provider.profile_image_url ? (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mr-4">
                  <img 
                    src={provider.profile_image_url} 
                    alt={provider.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with fallback
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
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
              <div className="mb-4 border rounded-md p-2 max-w-sm">
                <img 
                  src={provider.id_proof_url} 
                  alt="ID Proof" 
                  className="max-w-full h-auto rounded-md"
                  onError={(e) => {
                    // If image fails to load, replace with fallback
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                    target.parentElement?.classList.add('bg-red-50', 'p-4');
                    const errorMsg = document.createElement('p');
                    errorMsg.textContent = "Image could not be loaded";
                    errorMsg.className = "text-sm text-red-500 mt-2";
                    target.parentElement?.appendChild(errorMsg);
                  }}
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <p className="text-sm text-gray-500">No ID proof uploaded</p>
              </div>
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
