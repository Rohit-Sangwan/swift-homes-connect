
import React from 'react';
import { Star, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerQuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 mb-6 card-shadow">
      <h3 className="font-medium mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-blue-50 text-brand-blue mb-1 hover:scale-105 transition-transform shadow-sm">
            <Star size={22} />
          </Button>
          <span className="text-xs">Favorites</span>
        </div>
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-orange-50 text-brand-orange mb-1 hover:scale-105 transition-transform shadow-sm">
            <Clock size={22} />
          </Button>
          <span className="text-xs">History</span>
        </div>
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-green-50 text-green-600 mb-1 hover:scale-105 transition-transform shadow-sm">
            <Phone size={22} />
          </Button>
          <span className="text-xs">Support</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuickActions;
