
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

export interface Provider {
  id: string;
  name: string;
  phone: string;
  service_category: string;
  city: string;
  status: string;
  created_at: string;
}

export interface ServiceProviderTableProps {
  providers?: Provider[];
  updateProviderStatus?: (id: string, status: string) => Promise<void>;
  getStatusBadge?: (status: string) => React.ReactNode;
}

const ServiceProviderTable: React.FC<ServiceProviderTableProps> = (props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProviders();
    
    // Set up real-time subscription for provider changes
    const channel = supabase
      .channel('service-providers-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'service_providers' 
        }, 
        () => {
          fetchProviders();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, name, phone, service_category, city, status, created_at')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service providers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateProviderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `Provider status set to ${status}`,
      });
      
      // Updated data will be fetched through the real-time subscription
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} />;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
      </div>
    );
  }
  
  if (providers.length === 0) {
    return (
      <EmptyState 
        message="No applications yet" 
        description="When service providers apply, they'll appear here for review" 
      />
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell className="font-medium">{provider.name}</TableCell>
              <TableCell>{provider.service_category}</TableCell>
              <TableCell>{provider.city}</TableCell>
              <TableCell>{getStatusBadge(provider.status)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/workers/${provider.id}`)}
                  >
                    View
                  </Button>
                  {provider.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateProviderStatus(provider.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateProviderStatus(provider.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {provider.status === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => updateProviderStatus(provider.id, 'suspended')}
                    >
                      Suspend
                    </Button>
                  )}
                  {(provider.status === 'rejected' || provider.status === 'suspended') && (
                    <Button 
                      size="sm" 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateProviderStatus(provider.id, 'approved')}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceProviderTable;
