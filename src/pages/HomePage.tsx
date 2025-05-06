
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';

const serviceCategories = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', color: 'bg-blue-100' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', color: 'bg-yellow-100' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', color: 'bg-green-100' },
  { id: 'painting', name: 'Painting', icon: '🎨', color: 'bg-purple-100' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', color: 'bg-orange-100' },
  { id: 'gardening', name: 'Gardening', icon: '🌱', color: 'bg-lime-100' },
  { id: 'appliances', name: 'Appliances', icon: '🔌', color: 'bg-red-100' },
  { id: 'more', name: 'More', icon: '➕', color: 'bg-gray-100' },
];

const featuredWorkers = [
  {
    id: '1',
    name: 'John Smith',
    service: 'Plumbing',
    rating: 4.8,
    reviews: 124,
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    service: 'Cleaning',
    rating: 4.9,
    reviews: 87,
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'David Lee',
    service: 'Electrical',
    rating: 4.7,
    reviews: 56,
    image: '/placeholder.svg',
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <div className="px-4 py-4">
        {/* Search Bar */}
        <div 
          className="flex items-center bg-gray-100 rounded-full pl-4 pr-3 py-3 mb-8"
          onClick={() => navigate('/services')}
        >
          <Search size={18} className="text-gray-500 mr-3" />
          <span className="text-gray-500">Search for services...</span>
        </div>
        
        {/* Categories */}
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {serviceCategories.map((category) => (
            <div 
              key={category.id} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => navigate(`/services/${category.id}`)}
            >
              <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-2 text-xl`}>
                {category.icon}
              </div>
              <span className="text-xs text-center">{category.name}</span>
            </div>
          ))}
        </div>
        
        {/* Top Rated Professionals */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Rated Professionals</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-blue flex items-center"
            onClick={() => navigate('/services')}
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4 mb-8">
          {featuredWorkers.map(worker => (
            <div 
              key={worker.id} 
              className="bg-white rounded-xl p-4 flex items-center card-shadow animate-fade-in"
              onClick={() => navigate(`/workers/${worker.id}`)}
            >
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                <img 
                  src={worker.image} 
                  alt={worker.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{worker.name}</h3>
                <p className="text-sm text-gray-500">{worker.service}</p>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1">{worker.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({worker.reviews} reviews)</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 border-2 border-brand-blue text-brand-blue bg-blue-50 hover:bg-blue-100"
            onClick={() => navigate('/become-provider')}
          >
            Become a Provider
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 border-2 border-brand-orange text-brand-orange bg-orange-50 hover:bg-orange-100"
            onClick={() => navigate('/profile')}
          >
            User Account
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
