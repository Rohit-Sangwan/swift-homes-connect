
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import CategoryManager from '@/components/admin/CategoryManager';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AdminCategoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { user } = data.session;
        
        // Check if user is the admin by checking both metadata and email
        if (user?.app_metadata?.role === 'admin' || 
            user?.email?.toLowerCase() === 'nullcoder404official@gmail.com') {
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
      <PageContainer title="Admin - Categories" showBack>
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
    <PageContainer title="Admin - Categories" showBack>
      <div className="p-4">
        <CategoryManager />
      </div>
    </PageContainer>
  );
};

export default AdminCategoryPage;
