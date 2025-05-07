
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Award } from 'lucide-react';

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
      {providers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {provider.service_category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    {provider.city}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    {provider.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-gray-500" />
                    {provider.experience}
                  </div>
                </TableCell>
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
      ) : (
        <div className="py-8 text-center text-gray-500">
          No service providers found in this category.
        </div>
      )}
    </div>
  );
};

export default ServiceProviderTable;
