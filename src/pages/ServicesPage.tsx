
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageContainer from '@/components/PageContainer';

const serviceCategories = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', color: 'bg-blue-100' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', color: 'bg-yellow-100' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', color: 'bg-green-100' },
  { id: 'painting', name: 'Painting', icon: '🎨', color: 'bg-purple-100' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', color: 'bg-orange-100' },
  { id: 'gardening', name: 'Gardening', icon: '🌱', color: 'bg-lime-100' },
  { id: 'appliances', name: 'Appliances', icon: '🔌', color: 'bg-red-100' },
  { id: 'roofing', name: 'Roofing', icon: '🏠', color: 'bg-teal-100' },
  { id: 'hvac', name: 'HVAC', icon: '❄️', color: 'bg-indigo-100' },
  { id: 'flooring', name: 'Flooring', icon: '🧱', color: 'bg-rose-100' },
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCategories = serviceCategories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <PageContainer title="Services" showBack>
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Categories Grid */}
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredCategories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center cursor-pointer animate-fade-in"
              onClick={() => navigate(`/services/${category.id}`)}
            >
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mr-4 text-xl`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-xs text-gray-500">Find local experts</p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No services found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ServicesPage;
