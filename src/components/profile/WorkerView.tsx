
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const WorkerView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [providerStatus, setProviderStatus] = useState<string | null>(null);
  
  useEffect(() => {
    const checkProviderStatus = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        
        if (!userId) {
          setLoading(false);
          return;
        }
        
        // Check if user has already applied as a provider
        const { data, error } = await supabase
          .from('service_providers')
          .select('status')
          .eq('user_id', userId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking provider status:', error);
        }
        
        if (data) {
          setProviderStatus(data.status);
        }
      } catch (error) {
        console.error('Error in provider status check:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkProviderStatus();
  }, []);
  
  // Show different UI based on provider application status
  const renderProviderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
        </div>
      );
    }
    
    if (providerStatus === 'pending') {
      return (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Clock className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Application Under Review</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your service provider application is currently being reviewed by our team. We'll notify you once it's approved.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (providerStatus === 'approved') {
      return (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Application Approved</AlertTitle>
          <AlertDescription className="text-green-700">
            Your service provider application has been approved! You can now start receiving service requests.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (providerStatus === 'rejected') {
      return (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <XCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800">Application Rejected</AlertTitle>
          <AlertDescription className="text-red-700">
            Unfortunately, your service provider application has been rejected. Please contact support for more information.
          </AlertDescription>
        </Alert>
      );
    }
    
    // Default: No application yet
    return (
      <>
        <div className="bg-brand-blue/10 border-2 border-brand-blue/20 rounded-xl p-4 text-center">
          <h3 className="font-medium mb-2">Become a Service Provider</h3>
          <p className="text-sm text-gray-600 mb-3">
            List your services and start getting job requests from customers in your area.
          </p>
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90 rounded-full px-6"
            onClick={() => navigate('/become-provider')}
          >
            Register as Provider
          </Button>
        </div>
        
        <div className="bg-white rounded-xl p-4 card-shadow">
          <h3 className="font-medium mb-3">Benefits of being a Service Provider</h3>
          <div className="space-y-3">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
              <div>
                <h4 className="text-sm font-medium">Find Local Customers</h4>
                <p className="text-xs text-gray-500">Connect with customers in your area</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
              <div>
                <h4 className="text-sm font-medium">Direct Communication</h4>
                <p className="text-xs text-gray-500">Talk directly with customers via phone</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
              <div>
                <h4 className="text-sm font-medium">Build Reputation</h4>
                <p className="text-xs text-gray-500">Earn reviews and ratings for your work</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">✓</div>
              <div>
                <h4 className="text-sm font-medium">Free Registration</h4>
                <p className="text-xs text-gray-500">No fees to list your services</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderProviderContent()}
    </div>
  );
};

export default WorkerView;
