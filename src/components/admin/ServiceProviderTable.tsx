
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

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

interface ServiceProviderTableProps {
  providers: ServiceProvider[];
  updateProviderStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

const ServiceProviderTable: React.FC<ServiceProviderTableProps> = ({ 
  providers, 
  updateProviderStatus,
  getStatusBadge 
}) => {
  const navigate = useNavigate();
  
  return (
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
          {providers.map((provider) => (
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
  );
};

export default ServiceProviderTable;
