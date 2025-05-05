
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WorkerView: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default WorkerView;
