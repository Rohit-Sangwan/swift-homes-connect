
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

export default StatusBadge;
