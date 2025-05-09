import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Clipboard, ChevronRight, Star, Settings } from 'lucide-react';

const WorkerView = () => {
  const navigate = useNavigate();
  const [providerInfo, setProviderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetchProviderStatus();
  }, []);
  
  const fetchProviderStatus = async () => {
    try {
      setIsLoading(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) return;
      
      const { data: providerData, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .single();
        
      if (!error && providerData) {
        setProviderInfo(providerData);
      }
      
    } catch (error) {
      console.error('Error fetching provider status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading...</p>
      </div>
    );
  }
  
  if (providerInfo) {
    const isApproved = providerInfo.status === 'approved';
    
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Provider Status</h2>
                <Badge 
                  variant={isApproved ? "default" : "outline"}
                  className={
                    isApproved 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  }
                >
                  {isApproved ? 'Approved' : 'Pending Review'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {isApproved 
                  ? 'Your service provider account has been approved. You can now manage your services and bookings.' 
                  : 'Your application is still under review. We will notify you once it is approved.'}
              </p>
              
              {isApproved && (
                <Button
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                  onClick={() => navigate('/worker-dashboard')}
                >
                  Go to Worker Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {isApproved && (
          <div className="bg-white rounded-xl overflow-hidden card-shadow">
            <div 
              className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer"
              onClick={() => navigate('/worker-dashboard')}
            >
              <Clipboard size={18} className="text-gray-500 mr-3" />
              <span>Manage Bookings</span>
              <ChevronRight size={18} className="text-gray-400 ml-auto" />
            </div>
            <div 
              className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer"
              onClick={() => navigate('/worker-dashboard')}
            >
              <Star size={18} className="text-gray-500 mr-3" />
              <span>View Reviews</span>
              <ChevronRight size={18} className="text-gray-400 ml-auto" />
            </div>
            <div 
              className="flex items-center px-4 py-3 cursor-pointer"
              onClick={() => navigate('/worker-dashboard')}
            >
              <Settings size={18} className="text-gray-500 mr-3" />
              <span>Service Settings</span>
              <ChevronRight size={18} className="text-gray-400 ml-auto" />
            </div>
          </div>
        )}
        
        {!isApproved && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Application Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>Make sure your profile is complete with accurate information</li>
                <li>Upload a clear professional photo</li>
                <li>Provide a detailed description of your services</li>
                <li>Highlight your experience and qualifications</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 text-center">
          <h2 className="font-semibold mb-2">Become a Service Provider</h2>
          <p className="text-sm text-gray-600 mb-4">
            Register as a service provider to offer your services on our platform.
          </p>
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => navigate('/become-provider')}
          >
            Register Now
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Benefits of Becoming a Provider</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
            <li>Connect with customers in your area</li>
            <li>Flexible working hours</li>
            <li>Build your professional reputation</li>
            <li>Easy booking and payment management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerView;
