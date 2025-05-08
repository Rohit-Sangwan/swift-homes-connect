
import React from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  message: string;
  description: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  description, 
  icon = <PackageOpen className="h-12 w-12 text-gray-300" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
