
import React from 'react';

interface EmptyStateProps {
  status: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ status }) => {
  return (
    <div className="text-center py-8 border rounded-md bg-gray-50">
      <p className="text-gray-500">No {status} applications found</p>
    </div>
  );
};

export default EmptyState;
